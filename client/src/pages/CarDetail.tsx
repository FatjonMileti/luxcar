import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import FinancingCalculator from '../components/FinancingCalculator';
import { fetchCar, sendInquiry, formatPrice, formatKm, type Car } from '../api';

interface InquiryForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function CarDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null | undefined>(undefined);
  const [form, setForm] = useState<InquiryForm>({ name: '', phone: '', email: '', message: '' });
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    fetchCar(id)
      .then(setCar)
      .catch(() => setCar(null));
  }, [id]);

  if (car === null)
    return (
      <div className="section wrap">
        Makina nuk u gjet. <Link to="/cars">Kthehu</Link>
      </div>
    );
  if (!car) return <div className="section wrap">Duke ngarkuar…</div>;

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await sendInquiry({
        ...form,
        car: car._id,
        message: form.message || `Jam i interesuar për ${car.brand} ${car.model} ${car.year}`,
      });
      setMsg('Kërkesa u dërgua me sukses! Do t’ju kontaktojmë së shpejti.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setMsg('Gabim gjatë dërgimit.');
    }
  };

  return (
    <div className="section wrap">
      <Link to="/cars">← Kthehu te inventari</Link>
      <h1>
        {car.brand} {car.model} {car.year}
      </h1>
      <div className="detail-grid">
        <div>
          <img className="main" src={car.image} alt={`${car.brand} ${car.model}`} />
          <h3>Përshkrimi</h3>
          <p style={{ color: '#555' }}>{car.description}</p>
        </div>
        <div>
          <div style={{ background: '#111', color: '#fff', padding: 20, borderRadius: 8 }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#ff5a4d' }}>
              {formatPrice(car.price)}
            </div>
            <div style={{ color: '#bbb' }}>
              {car.status} {car.inspected ? '• ✔ Inspektuar' : ''}
            </div>
          </div>
          <table className="spec-table" style={{ marginTop: 16 }}>
            <tbody>
              <tr><td>Marka</td><td>{car.brand}</td></tr>
              <tr><td>Modeli</td><td>{car.model}</td></tr>
              <tr><td>Viti</td><td>{car.year}</td></tr>
              <tr><td>Kilometrat</td><td>{formatKm(car.mileage)}</td></tr>
              <tr><td>Karburanti</td><td>{car.fuel}</td></tr>
              <tr><td>Transmisioni</td><td>{car.transmission}</td></tr>
              <tr><td>Motori</td><td>{car.engine}</td></tr>
              <tr><td>Ngjyra</td><td>{car.color}</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop: 18 }}>
            <FinancingCalculator price={car.price} />
          </div>
          <div style={{ marginTop: 18, border: '1px solid #eee', borderRadius: 8, padding: 18 }}>
            <h4 style={{ marginTop: 0 }}>Kërko këtë makinë</h4>
            <form className="form-grid" onSubmit={submit}>
              <input
                placeholder="Emri*"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Telefoni*"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Mesazhi"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button className="btn-red" type="submit">
                Dërgo Kërkesën
              </button>
            </form>
            {msg && <p>{msg}</p>}
            <a
              className="btn-dark"
              style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
              href="tel:+355696269999"
            >
              📞 +355 696 269 999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
