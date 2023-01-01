import { Link } from 'react-router-dom';
import { formatPrice, formatKm, type Car } from '../api';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps): JSX.Element {
  const normalizedStatus = car.status.toLowerCase();
  const statusClass: string =
    normalizedStatus.includes('stock') ? 'stock' : normalizedStatus.includes('sold') ? 'sold' : 'road';
  return (
    <div className="car-card">
      <Link to={`/cars/${car._id}`}>
        <img
          src={car.image || 'https://via.placeholder.com/800x500?text=LuxCar'}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
        />
      </Link>
      <div className="car-body">
        <span className={`badge ${statusClass}`}>{car.status}</span>
        <h3>
          <Link to={`/cars/${car._id}`}>
            {car.brand} {car.model} {car.year}
          </Link>
        </h3>
        <div className="car-price">{formatPrice(car.price)}</div>
        <div className="car-meta">
          <span>{formatKm(car.mileage)}</span>
          <span>{car.fuel}</span>
          <span>{car.transmission}</span>
          <span>{car.engine}</span>
          {car.inspected && <span>✔ Inspektuar</span>}
        </div>
        <Link
          to={`/cars/${car._id}`}
          className="btn-red"
          style={{ display: 'block', textAlign: 'center', padding: '10px' }}
        >
          Shiko Detajet
        </Link>
      </div>
    </div>
  );
}
