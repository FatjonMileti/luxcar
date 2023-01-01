import { useState, type FormEvent } from 'react';
import { sendInquiry } from '../api';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function Contact(): JSX.Element {
  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', email: '', message: '' });
  const [msg, setMsg] = useState<string>('');

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await sendInquiry(form);
      setMsg('Mesazhi u dërgua! Faleminderit.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setMsg('Gabim. Provoni përsëri.');
    }
  };

  return (
    <div className="section wrap">
      <small style={{ color: '#d9261c', fontWeight: 800 }}>KONTAKT</small>
      <h1>Na Kontaktoni</h1>
      <div className="split">
        <div>
          <p>📍 Rruga Irfan Tomini 4, Tirana 1020, Albania</p>
          <p>📞 +355 696 269 999</p>
          <p>📞 +355 695 141 436</p>
          <p>✉️ info@luxcar.al</p>
          <p>🕘 E Hënë – E Shtunë: 09:00 – 19:00</p>
          <iframe
            title="map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=19.80%2C41.32%2C19.84%2C41.34&layer=mapnik"
            style={{ width: '100%', height: 280, border: 0, borderRadius: 8 }}
          />
        </div>
        <form
          className="form-grid"
          onSubmit={submit}
          style={{ background: '#fafafa', padding: 20, borderRadius: 8 }}
        >
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
            placeholder="Mesazhi*"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button className="btn-red" type="submit">
            Dërgo
          </button>
          {msg && <p>{msg}</p>}
        </form>
      </div>
    </div>
  );
}
