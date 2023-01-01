import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFilters, type FilterOptions, type CarQuery } from '../api';

interface SearchForm {
  year: string;
  brand: string;
  model: string;
  mileageMax: string;
  transmission: string;
  inspected: string;
  engine: string;
  fuel: string;
  priceMax: string;
}

interface SearchBarProps {
  initial?: Partial<SearchForm>;
  onSearch?: (params: CarQuery) => void;
}

const emptyForm: SearchForm = {
  year: '',
  brand: '',
  model: '',
  mileageMax: '',
  transmission: '',
  inspected: '',
  engine: '',
  fuel: '',
  priceMax: '',
};

const fallbackFilters: FilterOptions = {
  brands: [],
  models: [],
  years: [],
  fuels: [],
  transmissions: [],
  engines: [],
  priceRange: { min: 0, max: 100000 },
};

// Hero search like luxcar.al: Year, Brand, Model, Mileage, Transmission, Inspected, Engine, Fuel, Price
export default function SearchBar({ initial = {}, onSearch }: SearchBarProps): JSX.Element {
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [form, setForm] = useState<SearchForm>({ ...emptyForm, ...initial });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFilters().then(setFilters).catch(() => setFilters(fallbackFilters));
  }, []);

  const set = (k: keyof SearchForm, v: string): void =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent): void => {
    e.preventDefault();
    const params: CarQuery = {};
    (Object.entries(form) as [keyof SearchForm, string][]).forEach(([k, v]) => {
      if (v !== '' && v !== 'all') params[k] = v;
    });
    if (onSearch) onSearch(params);
    else {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      navigate(`/cars?${qs}`);
    }
  };

  const sel = (label: string, key: keyof SearchForm, options: (string | number)[]): JSX.Element => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700 }}>{label}</label>
      <select value={form[key]} onChange={(e) => set(key, e.target.value)}>
        <option value="">--Select--</option>
        {options.map((o) => (
          <option key={String(o)} value={String(o)}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  if (!filters) return <div className="search-box">Duke ngarkuar filtrat…</div>;

  return (
    <form className="search-box" onSubmit={submit}>
      <div className="search-grid">
        {sel('Select Viti', 'year', filters.years.map(String))}
        {sel('Select Marka', 'brand', filters.brands)}
        {sel('Select Modeli', 'model', filters.models)}
        <div>
          <label style={{ fontSize: 12, fontWeight: 700 }}>Select Kilometrat</label>
          <select value={form.mileageMax} onChange={(e) => set('mileageMax', e.target.value)}>
            <option value="">--Select--</option>
            <option value="30000">deri 30,000 km</option>
            <option value="60000">deri 60,000 km</option>
            <option value="100000">deri 100,000 km</option>
            <option value="150000">deri 150,000 km</option>
          </select>
        </div>
        {sel('Select Transmesioni', 'transmission', filters.transmissions)}
        <div>
          <label style={{ fontSize: 12, fontWeight: 700 }}>Select Inspektuar</label>
          <select value={form.inspected} onChange={(e) => set('inspected', e.target.value)}>
            <option value="">--Select--</option>
            <option value="true">Po</option>
            <option value="false">Jo</option>
          </select>
        </div>
        {sel('Select Motori', 'engine', filters.engines)}
        {sel('Select Karburanti', 'fuel', filters.fuels)}
      </div>
      <div className="search-actions">
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Price (max €): {form.priceMax || '—'}
          </label>
          <input
            type="range"
            min="5000"
            max="50000"
            step="500"
            value={form.priceMax || 50000}
            onChange={(e) => set('priceMax', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button className="btn-red" type="submit">
          Kerko Makina
        </button>
      </div>
    </form>
  );
}
