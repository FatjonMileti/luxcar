import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard';
import FinancingCalculator from '../components/FinancingCalculator';
import { fetchCars, fetchFilters, type CarListResponse, type FilterOptions } from '../api';

export default function Cars(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<CarListResponse>({ cars: [], total: 0, page: 1, pages: 0 });
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [sort, setSort] = useState<string>('date');

  const q: Record<string, string> = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    fetchFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    fetchCars({ ...q, sort, limit: 12 })
      .then(setData)
      .catch(() => setData({ cars: [], total: 0, page: 1, pages: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sort]);

  const setQ = (k: string, v: string): void => {
    const next = new URLSearchParams(searchParams);
    if (!v) next.delete(k);
    else next.set(k, v);
    setSearchParams(next);
  };

  return (
    <div className="section wrap">
      <h1>Inventory — Makinat Tona</h1>
      <p style={{ color: '#555' }}>{data.total} makina u gjetën</p>
      <div className="inventory">
        <aside className="sidebar">
          <h4>Vehicles Filters</h4>
          <label>Marka</label>
          <select value={q.brand || ''} onChange={(e) => setQ('brand', e.target.value)}>
            <option value="">Të gjitha</option>
            {(filters?.brands || []).map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <label>Modeli</label>
          <select value={q.model || ''} onChange={(e) => setQ('model', e.target.value)}>
            <option value="">Të gjitha</option>
            {(filters?.models || []).map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <label>Viti</label>
          <select value={q.year || ''} onChange={(e) => setQ('year', e.target.value)}>
            <option value="">Të gjitha</option>
            {(filters?.years || []).map((v: number) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <label>Karburanti</label>
          <select value={q.fuel || ''} onChange={(e) => setQ('fuel', e.target.value)}>
            <option value="">Të gjitha</option>
            {(filters?.fuels || []).map((v: string) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <label>Transmisioni</label>
          <select
            value={q.transmission || ''}
            onChange={(e) => setQ('transmission', e.target.value)}
          >
            <option value="">Të gjitha</option>
            {(filters?.transmissions || []).map((v: string) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <label>Çmimi max (€)</label>
          <input
            placeholder="p.sh. 20000"
            value={q.priceMax || ''}
            onChange={(e) => setQ('priceMax', e.target.value)}
          />
          <label>Km max</label>
          <input
            placeholder="p.sh. 60000"
            value={q.mileageMax || ''}
            onChange={(e) => setQ('mileageMax', e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn-dark" style={{ flex: 1 }} onClick={() => setSearchParams({})}>
              Reset
            </button>
          </div>
          <div style={{ marginTop: 20 }}>
            <FinancingCalculator price={20000} />
          </div>
        </aside>
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: 10 }}>
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="name">Sort by Name</option>
              <option value="year">Sort by Year</option>
            </select>
          </div>
          {data.cars.length === 0 ? (
            <p>No result were found matching your selection.</p>
          ) : (
            <div className="cars-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {data.cars.map((c) => (
                <CarCard key={c._id} car={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
