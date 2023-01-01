import { useState } from 'react';

interface FinancingCalculatorProps {
  price?: number;
}

export default function FinancingCalculator({ price = 20000 }: FinancingCalculatorProps): JSX.Element {
  const [loan, setLoan] = useState<number>(price);
  const [down, setDown] = useState<number>(Math.round(price * 0.2));
  const [rate, setRate] = useState<number>(6.5);
  const [months, setMonths] = useState<number>(60);

  const principal: number = Math.max(0, Number(loan) - Number(down));
  const r: number = Number(rate) / 100 / 12;
  const n: number = Number(months);
  const payment: number =
    r > 0
      ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : principal / n;

  return (
    <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: 18 }}>
      <h4 style={{ marginTop: 0 }}>Financing Calculator</h4>
      <div className="form-grid">
        <label>
          Loan Amount*
          <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        </label>
        <label>
          Down Payment*
          <input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </label>
        <label>
          Interest Rate (%)*
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </label>
        <label>
          Period (Month)*
          <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        {[12, 24, 36, 48, 60].map((m: number) => (
          <button
            key={m}
            type="button"
            className="btn-outline"
            style={{
              padding: '6px 10px',
              background: months === m ? '#111' : '#fff',
              color: months === m ? '#fff' : '#111',
            }}
            onClick={() => setMonths(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>
        Pagesa: {isFinite(payment) ? payment.toFixed(2) + ' €/muaj' : '-'}
      </div>
    </div>
  );
}
