import { Router, Request, Response } from 'express';
import { cacheMiddleware } from 'http-cache-lite';
import { Inquiry } from '../models/Inquiry';
import { INQUIRIES_TAG, httpCache, invalidateInquiries } from '../cache';

const router = Router();

const cacheInquiries = cacheMiddleware({
  cache: httpCache,
  tags: [INQUIRIES_TAG],
  cacheControl: true,
});

router.get('/', cacheInquiries, async (_req: Request, res: Response): Promise<void> => {
  const items = await Inquiry.find()
    .sort({ createdAt: -1 })
    .populate('car', 'brand model year price');
  res.json(items);
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, message, car } = req.body as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
      car?: string | null;
    };
    if (!name || !phone || !message) {
      res.status(400).json({ message: 'Name, phone and message are required' });
      return;
    }
    const item = await Inquiry.create({ name, phone, email, message, car: car || null });
    await invalidateInquiries();
    res.status(201).json(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  await Inquiry.findByIdAndDelete(req.params.id);
  await invalidateInquiries();
  res.json({ message: 'Deleted' });
});

export default router;
