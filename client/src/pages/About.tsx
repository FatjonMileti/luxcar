export default function About(): JSX.Element {
  return (
    <div className="section wrap">
      <small style={{ color: '#d9261c', fontWeight: 800 }}>RETH NESH</small>
      <h1>Kush jemi ne</h1>
      <p>
        LuxCar Albania është kompani e specializuar në importimin e makinave të reja dhe të
        përdorura nga Koreja e Jugut. Furnizojmë individë, kompani rent-a-car dhe tregtarë
        makinash në Shqipëri dhe Ballkan.
      </p>
      <div className="split" style={{ marginTop: 24 }}>
        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80" alt="Zyra" />
        <div>
          <h3>Pse LuxCar?</h3>
          <ul className="check">
            <li>Cilësi e verifikuar koreane me raport inspektimi</li>
            <li>Çmime transparente, pa kosto të fshehura</li>
            <li>Transport RO-RO ~35 ditë me ndjekje</li>
            <li>Garanci motorr, kambio dhe kilometra</li>
            <li>Ndihmë me dokumentacion & targim</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
