import { Router, Request, Response } from 'express';
import { cacheMiddleware } from 'http-cache-lite';
import { Car } from '../models/Car';
import { CARS_TAG, httpCache, invalidateCars } from '../cache';

const router = Router();

const cacheCars = cacheMiddleware({ cache: httpCache, tags: [CARS_TAG], cacheControl: true });

// GET /api/cars — list with filters like luxcar.al
// query: brand, model, year, yearMin, yearMax, fuel, transmission, engine,
//        inspected(true/false), priceMin, priceMax, mileageMax, search,
//        sort(name|price|date|year), order(asc|desc), featured, status, limit, page
router.get('/', cacheCars, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      brand,
      model,
      year,
      yearMin,
      yearMax,
      fuel,
      transmission,
      engine,
      inspected,
      priceMin,
      priceMax,
      mileageMax,
      search,
      sort,
      order,
      featured,
      status,
      page = '1',
      limit = '12',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (brand && brand !== 'all') filter.brand = new RegExp(`^${brand}$`, 'i');
    if (model && model !== 'all') filter.model = new RegExp(`^${model}$`, 'i');
    if (year) filter.year = Number(year);
    if (yearMin || yearMax) {
      const range: Record<string, number> = {};
      if (yearMin) range.$gte = Number(yearMin);
      if (yearMax) range.$lte = Number(yearMax);
      filter.year = range;
    }
    if (fuel && fuel !== 'all') filter.fuel = fuel;
    if (transmission && transmission !== 'all') filter.transmission = transmission;
    if (engine && engine !== 'all') filter.engine = new RegExp(engine, 'i');
    if (inspected === 'true') filter.inspected = true;
    if (inspected === 'false') filter.inspected = false;
    if (priceMin || priceMax) {
      const range: Record<string, number> = {};
      if (priceMin) range.$gte = Number(priceMin);
      if (priceMax) range.$lte = Number(priceMax);
      filter.price = range;
    }
    if (mileageMax) filter.mileage = { $lte: Number(mileageMax) };
    if (featured === 'true') filter.featured = true;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price') sortObj = { price: order === 'asc' ? 1 : -1 };
    if (sort === 'name') sortObj = { brand: 1, model: 1 };
    if (sort === 'year') sortObj = { year: order === 'asc' ? 1 : -1 };
    if (sort === 'date') sortObj = { createdAt: order === 'asc' ? 1 : -1 };

    const pg = Math.max(1, Number(page));
    const lim = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pg - 1) * lim;

    const [total, cars] = await Promise.all([
      Car.countDocuments(filter),
      Car.find(filter).sort(sortObj).skip(skip).limit(lim),
    ]);

    res.json({ total, page: pg, pages: Math.ceil(total / lim), cars });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message });
  }
});

// GET distinct filter values for the search bar
router.get('/filters', cacheCars, async (_req: Request, res: Response): Promise<void> => {
  try {
    const [brands, models, years, fuels, transmissions, engines] = await Promise.all([
      Car.distinct('brand'),
      Car.distinct('model'),
      Car.distinct('year'),
      Car.distinct('fuel'),
      Car.distinct('transmission'),
      Car.distinct('engine'),
    ]);
    (years as number[]).sort((a, b) => b - a);
    const price = await Car.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]);
    res.json({
      brands,
      models,
      years,
      fuels,
      transmissions,
      engines,
      priceRange: price[0] ?? { min: 0, max: 100000 },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message });
  }
});

router.get('/:id', cacheCars, async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }
    res.json(car);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.create(req.body);
    await invalidateCars();
    res.status(201).json(car);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ message });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }
    await invalidateCars();
    res.json(car);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }
    await invalidateCars();
    res.json({ message: 'Car deleted' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message });
  }
});

export default router;
