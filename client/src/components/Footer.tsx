import { Link } from 'react-router-dom';

export default function Footer(): JSX.Element {
  return (
    <>
      <div className="cta">
        <h2>Na kontaktoni për të zbuluar më shumë rreth shërbimeve tona!</h2>
        <p>Import i sigurt nga Koreja e Jugut — inspektim, transport RO-RO dhe garanci.</p>
        <Link to="/contact" className="btn-dark">
          Na Kontaktoni
        </Link>
      </div>
      <footer className="footer">
        <div className="cols">
          <div>
            <h4>LUXCAR ALBANIA</h4>
            <p>
              Partneri juaj i besueshëm për importin e makinave nga Koreja e Jugut. Cilësi,
              besueshmëri dhe shërbim të jashtëzakonshëm.
            </p>
            <p>
              📍 Rruga Irfan Tomini 4, Tirana 1020, Albania
              <br />
              📞 +355 696 269 999
              <br />
              📞 +355 695 141 436
              <br />
              ✉️ info@luxcar.al
            </p>
          </div>
          <div>
            <h4>Linke</h4>
            <p>
              <Link to="/">Home</Link>
              <br />
              <Link to="/about">Reth Nesh</Link>
              <br />
              <Link to="/services">Shërbimet</Link>
              <br />
              <Link to="/cars">Makinat Tona</Link>
              <br />
              <Link to="/contact">Kontakt</Link>
            </p>
          </div>
          <div>
            <h4>Orari</h4>
            <p>
              E Hënë – E Premte: 09:00 – 19:00
              <br />
              E Shtunë: 09:00 – 15:00
              <br />
              E Diel: Mbyllur
            </p>
          </div>
        </div>
        <div className="copy">© 2026 LuxCar Albania (MERN demo) — Rindërtuar si aplikacion MERN.</div>
      </footer>
    </>
  );
}
