import { useEffect, useState, type FormEvent } from 'react';
import { formatPrice, type Car, type CarInput } from '../api';
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminApiError,
  createAdminCar,
  deleteAdminCar,
  deleteAdminInquiry,
  fetchAdminCars,
  fetchAdminInquiries,
  fetchAdminStats,
  getAdminToken,
  updateAdminCar,
  updateInquiryStatus,
  type AdminInquiry,
  type AdminMe,
  type AdminStats,
} from '../adminApi';

const emptyCar: CarInput = {
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

type Tab = 'dashboard' | 'cars' | 'inquiries';

export default function Admin(): JSX.Element {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (!getAdminToken()) {
      setAuthChecked(true);
      return;
    }
    adminMe()
      .then(setMe)
      .catch(() => adminLogout())
      .finally(() => setAuthChecked(true));
  }, []);

  const doLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoginError('');
    try {
      await adminLogin(email, password);
      setMe(await adminMe());
      setPassword('');
    } catch (err) {
      setLoginError(adminApiError(err));
    }
  };

  const doLogout = (): void => {
    adminLogout();
    setMe(null);
  };

  if (!authChecked) return <div className="section wrap">Duke ngarkuar…</div>;

  if (!me) {
    return (
      <div className="section wrap" style={{ maxWidth: 440 }}>
        <small style={{ color: '#d9261c', fontWeight: 800 }}>ADMIN</small>
        <h1>Admin Login</h1>
        <p style={{ color: '#555' }}>
          Sign in with your admin account to manage cars and inquiries. (FastAPI backend)
        </p>
        <form
          className="form-grid"
          onSubmit={doLogin}
          style={{ background: '#fafafa', padding: 20, borderRadius: 8 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-red" type="submit">
            Login
          </button>
          {loginError && <p style={{ color: '#a81a12' }}>{loginError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="section wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <small style={{ color: '#d9261c', fontWeight: 800 }}>ADMIN CONSOLE</small>
          <h1 style={{ margin: '4px 0' }}>Mirësevini, {me.email}</h1>
        </div>
        <button className="btn-dark" onClick={doLogout}>
          Logout
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0 24px' }}>
        {(['dashboard', 'cars', 'inquiries'] as Tab[]).map((t) => (
          <button
            key={t}
            className={tab === t ? 'btn-red' : 'btn-outline'}
            style={{ textTransform: 'capitalize' }}
            onClick={() => setTab(t)}
          >
            {t === 'dashboard' ? 'Dashboard' : t === 'cars' ? 'Makinat' : 'Kërkesat'}
          </button>
        ))}
      </div>
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'cars' && <CarsManager />}
      {tab === 'inquiries' && <InquiriesManager />}
    </div>
  );
}

function Dashboard(): JSX.Element {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((err) => setError(adminApiError(err)));
  }, []);

  if (error) return <p style={{ color: '#a81a12' }}>{error}</p>;
  if (!stats) return <p>Duke ngarkuar statistikat…</p>;

  const cards: [string, string][] = [
    ['Total cars', String(stats.totalCars)],
    ['In stock', String(stats.inStock)],
    ['In transit', String(stats.inTransit)],
    ['Sold', String(stats.sold)],
    ['Featured', String(stats.featured)],
    ['Total inquiries', String(stats.totalInquiries)],
    ['New inquiries', String(stats.newInquiries)],
    ['Stock value', formatPrice(stats.totalStockValue)],
  ];

  return (
    <div className="steps" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
      {cards.map(([label, value]) => (
        <div key={label} className="step-card">
          <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
          <p style={{ color: '#555', margin: '6px 0 0' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function CarsManager(): JSX.Element {
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [form, setForm] = useState<CarInput>(emptyCar);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const load = async (): Promise<void> => {
    try {
      const d = await fetchAdminCars({ search, status, limit: 50 });
      setCars(d.cars);
      setTotal(d.total);
    } catch (err) {
      setError(adminApiError(err));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof CarInput>(k: K, v: CarInput[K]): void =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      const payload: CarInput = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
      };
      if (editing) await updateAdminCar(editing, payload);
      else await createAdminCar(payload);
      setForm(emptyCar);
      setEditing(null);
      await load();
      window.scrollTo(0, 0);
    } catch (err) {
      setError(adminApiError(err));
    }
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
    if (!confirm('Fshi makinën?')) return;
    try {
      await deleteAdminCar(id);
      await load();
    } catch (err) {
      setError(adminApiError(err));
    }
  };

  const applyFilters = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await load();
  };

  return (
    <div>
      <form
        onSubmit={submit}
        style={{ background: '#fafafa', padding: 18, borderRadius: 8, marginBottom: 24 }}
      >
        <h3 style={{ marginTop: 0 }}>{editing ? 'Përditëso makinën' : 'Shto makinë të re'}</h3>
        <div className="search-grid">
          <input
            placeholder="Brand*"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            required
          />
          <input
            placeholder="Model*"
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Year*"
            value={form.year}
            onChange={(e) => set('year', Number(e.target.value))}
            required
          />
          <input
            type="number"
            placeholder="Price €*"
            value={form.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
          />
          <input
            type="number"
            placeholder="Mileage km*"
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
            placeholder="Engine*"
            value={form.engine}
            onChange={(e) => set('engine', e.target.value)}
            required
          />
          <input
            placeholder="Color"
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
            Inspected
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
            placeholder="Description"
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
                setForm(emptyCar);
              }}
            >
              Anulo
            </button>
          )}
        </div>
        {error && <p style={{ color: '#a81a12' }}>{error}</p>}
      </form>

      <form onSubmit={applyFilters} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          placeholder="Search brand / model…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 4 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="">All statuses</option>
          <option>In Stock</option>
          <option>In Transit</option>
          <option>Sold</option>
          <option>On Order</option>
        </select>
        <button className="btn-dark" type="submit">
          Filter
        </button>
      </form>

      <h3>Inventory ({total})</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
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
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InquiriesManager(): JSX.Element {
  const [items, setItems] = useState<AdminInquiry[]>([]);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const load = async (s = status): Promise<void> => {
    try {
      setItems(await fetchAdminInquiries(s || undefined));
    } catch (err) {
      setError(adminApiError(err));
    }
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (id: string, s: AdminInquiry['status']): Promise<void> => {
    try {
      await updateInquiryStatus(id, s);
      await load();
    } catch (err) {
      setError(adminApiError(err));
    }
  };

  const remove = async (id: string): Promise<void> => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await deleteAdminInquiry(id);
      await load();
    } catch (err) {
      setError(adminApiError(err));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['', 'New', 'Read', 'Closed'].map((s) => (
          <button
            key={s || 'all'}
            className={status === s ? 'btn-red' : 'btn-outline'}
            onClick={() => {
              setStatus(s);
              load(s);
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      {error && <p style={{ color: '#a81a12' }}>{error}</p>}
      <h3>Inquiries ({items.length})</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Car</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i: AdminInquiry) => (
              <tr key={i._id}>
                <td>{i.name}</td>
                <td>{i.phone}</td>
                <td>{i.carLabel || '—'}</td>
                <td>{i.message}</td>
                <td>
                  <select
                    value={i.status}
                    onChange={(e) =>
                      changeStatus(i._id, e.target.value as AdminInquiry['status'])
                    }
                  >
                    <option>New</option>
                    <option>Read</option>
                    <option>Closed</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-outline"
                    style={{ padding: '4px 10px' }}
                    onClick={() => remove(i._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
