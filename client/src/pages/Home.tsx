import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import { fetchCars, type Car } from '../api';

export default function Home(): JSX.Element {
  const [featured, setFeatured] = useState<Car[]>([]);

  useEffect(() => {
    fetchCars({ featured: 'true', limit: 6 })
      .then((d) => setFeatured(d.cars))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <small style={{ color: '#d9261c', fontWeight: 800, letterSpacing: 2 }}>
            IMPORT NGA KOREJA E JUGUT
          </small>
          <h1>
            Gjej Makinën Tënde <span>Premium</span>
          </h1>
          <p>Makina të reja dhe të përdorura, të inspektuara dhe me garanci.</p>
          <img
            className="hero-car"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80"
            alt="LuxCar hero"
          />
        </div>
        <div className="wrap">
          <SearchBar />
        </div>
      </section>

      <section className="section wrap" style={{ textAlign: 'center' }}>
        <small style={{ color: '#d9261c', fontWeight: 800 }}>MIRËSEVINI NË LUXCAR</small>
        <h2>partneri juaj i besueshëm për importin e makinave nga Koreja e Jugut!</h2>
        <p style={{ maxWidth: 800, margin: 'auto', color: '#555' }}>
          Ne jemi një kompani e specializuar në{' '}
          <b>importimin e makinave të reja dhe të përdorura</b> nga Koreja e Jugut, duke u ofruar
          klientëve shqiptarë dhe atyre në Ballkan{' '}
          <b>cilësi, besueshmëri dhe shërbim të jashtëzakonshëm</b>.
        </p>
      </section>

      <section className="section" style={{ background: '#f4f4f5' }}>
        <div className="wrap">
          <div className="section-title">
            <small>Si funksionon</small>
            <h2>Procesi i porositjes së makinës</h2>
          </div>
          <div className="steps">
            {[
              ['1', 'Gjetja e Makinës', 'Zgjidhni makinën nga katalogu ynë ose kërkoni model të personalizuar nga Koreja.'],
              ['2', 'Inspektim i Detajuar', 'Kontroll teknik, i jashtëm/i brendshëm dhe testim performance para blerjes.'],
              ['3', 'Transport RO-RO 35 Ditë', 'Transport i sigurt detar RO-RO nga Koreja në Shqipëri për ~35 ditë.'],
              ['4', 'Garanci Motorr Kambio Km', 'Garanci për motorr, kambio dhe kilometra të verifikuara.'],
            ].map(([n, t, d]: string[]) => (
              <div key={n} className="step-card">
                <div className="num">{n}</div>
                <h3>{t}</h3>
                <p style={{ color: '#555', fontSize: 14 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap split">
        <img
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80"
          alt="Inspektimi"
        />
        <div>
          <small style={{ color: '#d9261c', fontWeight: 800 }}>
            INSPEKTIM I PLOTË PËR ÇDO MAKINË
          </small>
          <h2>Inspektimi përfshin:</h2>
          <ul className="check">
            <li>
              <b>Kontroll teknik:</b> gjendja motorike, frenat, drejtimi, transmisioni.
            </li>
            <li>
              <b>Kontrolli i jashtëm dhe i brendshëm:</b> dëmtime, gërvishtje, konsum.
            </li>
            <li>
              <b>Testim shpejtësie dhe performance:</b> prova në kushte reale.
            </li>
          </ul>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link to="/services" className="btn-red">
              Shërbimet tona
            </Link>
            <a href="tel:+355696269999" className="btn-dark">
              📞 +355 696 269 999
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#111114', color: '#fff' }}>
        <div className="wrap">
          <div className="section-title">
            <small>Zgjedhjet tona</small>
            <h2 style={{ color: '#fff' }}>Our Featured Cars</h2>
          </div>
          <div className="cars-grid">
            {featured.map((c: Car) => (
              <CarCard key={c._id} car={c} />
            ))}
          </div>
          {featured.length === 0 && (
            <p style={{ textAlign: 'center' }}>
              Sapo po ngarkojmë makinat… nisni backend-in dhe bëni seed.
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/cars" className="btn-red">
              Shiko Të Gjitha Makinat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
