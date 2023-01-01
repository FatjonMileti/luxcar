import { useEffect, useState, type FormEvent } from 'react';
import {
  fetchCars,
  createCar,
  updateCar,
  deleteCar,
  fetchInquiries,
  formatPrice,
  type Car,
  type CarInput,
  type Inquiry,
} from '../api';

const empty: CarInput = {
  brand: '',
  model: '',
  year: 2021,
  price: 15000,
  mileage: 50000,
  fuel: 'Petrol',
  transmission: 'Automatic',
  engine: '2.0L',
  inspected: true,
  color: '',
  description: '',
  image: '',
  images: [],
  featured: false,
  status: 'In Stock',
};

export default function Admin(): JSX.Element {
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState<CarInput>(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    const d = await fetchCars({ limit: 50 });
    setCars(d.cars);
    try {
      setInquiries(await fetchInquiries());
    } catch {
      /* ignore if empty */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof CarInput>(k: K, v: CarInput[K]): void =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const payload: CarInput = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
    };
    if (editing) await updateCar(editing, payload);
    else await createCar(payload);
    setForm(empty);
    setEditing(null);
    load();
  };

  const edit = (c: Car): void => {
    setEditing(c._id);
    const { _id, createdAt, updatedAt, ...rest } = c;
    void _id;
    void createdAt;
    void updatedAt;
    setForm(rest as CarInput);
    window.scrollTo(0, 0);
  };

  const remove = async (id: string): Promise<void> => {
    if (confirm('Fshi makinën?')) {
      await deleteCar(id);
      load();
    }
  };

  return (
    <div className="section wrap">
      <h1>Admin — Menaxho Makinat</h1>
      <form
        onSubmit={submit}
        style={{ background: '#fafafa', padding: 18, borderRadius: 8, marginBottom: 24 }}
      >
        <h3 style={{ marginTop: 0 }}>{editing ? 'Përditëso makinën' : 'Shto makinë të re'}</h3>
        <div className="search-grid">
          <input
            placeholder="Marka*"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            required
          />
          <input
            placeholder="Modeli*"
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Viti*"
            value={form.year}
            onChange={(e) => set('year', Number(e.target.value))}
            required
          />
          <input
            type="number"
            placeholder="Çmimi €*"
            value={form.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
          />
          <input
            type="number"
            placeholder="Km*"
            value={form.mileage}
            onChange={(e) => set('mileage', Number(e.target.value))}
            required
          />
          <select value={form.fuel} onChange={(e) => set('fuel', e.target.value)}>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
            <option>LPG</option>
            <option>CNG</option>
          </select>
          <select value={form.transmission} onChange={(e) => set('transmission', e.target.value)}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
          <input
            placeholder="Motori*"
            value={form.engine}
            onChange={(e) => set('engine', e.target.value)}
            required
          />
          <input
            placeholder="Ngjyra"
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            style={{ gridColumn: 'span 2' }}
          />
          <select value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option>In Stock</option>
            <option>In Transit</option>
            <option>Sold</option>
            <option>On Order</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={form.inspected}
              onChange={(e) => set('inspected', e.target.checked)}
            />{' '}
            Inspektuar
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />{' '}
            Featured
          </label>
          <input
            placeholder="Përshkrimi"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            style={{ gridColumn: 'span 2' }}
          />
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn-red" type="submit">
            {editing ? 'Ruaj' : 'Shto'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Anulo
            </button>
          )}
        </div>
      </form>

      <h3>Inventari ({cars.length})</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Makina</th>
              <th>Viti</th>
              <th>Çmimi</th>
              <th>Status</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c: Car) => (
              <tr key={c._id}>
                <td>
                  {c.brand} {c.model}
                </td>
                <td>{c.year}</td>
                <td>{formatPrice(c.price)}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    className="btn-outline"
                    style={{ padding: '4px 10px', marginRight: 6 }}
                    onClick={() => edit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-outline"
                    style={{ padding: '4px 10px' }}
                    onClick={() => remove(c._id)}
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 30 }}>Kërkesat / Mesazhet ({inquiries.length})</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Emri</th>
              <th>Telefoni</th>
              <th>Makina</th>
              <th>Mesazhi</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((i: Inquiry) => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.phone}</td>
                <td>
                  {typeof i.car === 'object' && i.car !== null
                    ? `${(i.car as Car).brand} ${(i.car as Car).model}`
                    : '—'}
                </td>
                <td>{i.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
