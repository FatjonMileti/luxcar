import { Link } from 'react-router-dom';

const services: [string, string][] = [
  ['Gjetja e Makinës', 'Gjejmë modelin që kërkoni në ankandet dhe tregun korean me çmimin më të mirë.'],
  ['Inspektim i Detajuar', 'Raport i plotë: motorr, kambio, aksidente, kilometra, foto/video reale.'],
  ['Transport RO-RO 35 Ditë', 'Logjistikë detare e siguruar nga Koreja në Durrës.'],
  ['Garanci Motorr Kambio Km', 'Garanci dhe verifikim kilometrash për çdo makinë.'],
  ['Zhdoganim & Targim', 'Ju ndihmojmë me dokumentet, zhdoganimin dhe regjistrimin.'],
  ['Shitje për Tregtarë', 'Oferta me shumicë për autoshallqe dhe rent-a-car.'],
];

export default function Services(): JSX.Element {
  return (
    <div className="section wrap">
      <small style={{ color: '#d9261c', fontWeight: 800 }}>SHËRBIMET TONA</small>
      <h1>Çfarë ofrojmë</h1>
      <div className="steps" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {services.map(([t, d]: [string, string], i: number) => (
          <div key={t} className="step-card">
            <div className="num">{i + 1}</div>
            <h3>{t}</h3>
            <p style={{ color: '#555', fontSize: 14 }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link to="/contact" className="btn-red">
          Kërko Ofertë
        </Link>
      </div>
    </div>
  );
}
