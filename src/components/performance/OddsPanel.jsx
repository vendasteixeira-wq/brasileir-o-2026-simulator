import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer
} from 'recharts';

const GRID = '#1e2e44';
const TICK = { fill: '#5a7090', fontSize: 10 };
const TIP = {
  contentStyle: { background: '#131b28', border: '1px solid #1e2e44', borderRadius: 6, fontSize: 11, color: '#e0e8f0' },
  labelStyle: { color: '#29b6f6', fontSize: 11 }
};

function barColor(pct) {
  if (pct >= 30) return '#00e676';
  if (pct >= 10) return '#7ee787';
  if (pct >= 3) return '#ffd600';
  return '#5a7090';
}

export default function OddsPanel({ odds }) {
  const top = odds.slice(0, 10);

  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
      <div className="pnl" style={{ margin: 0 }}>
        <div className="pt"><i className="fas fa-trophy" style={{ color: 'var(--ac2)' }}></i> Probabilidade de Título</div>
        <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5, marginBottom: 8 }}>
          Monte Carlo sobre a temporada completa (38 rodadas) com o modelo Dixon-Coles. Top 10 clubes.
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} layout="vertical" margin={{ top: 0, right: 24, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={TICK} stroke={GRID} unit="%" />
              <YAxis type="category" dataKey="team" tick={{ ...TICK, fontSize: 9 }} stroke={GRID} width={86} />
              <Tooltip {...TIP} formatter={(v) => [`${v}%`, 'Título']} />
              <Bar dataKey="titulo" radius={[0, 3, 3, 0]}>
                {top.map(t => <Cell key={t.team} fill={barColor(t.titulo)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pnl" style={{ margin: 0 }}>
        <div className="pt"><i className="fas fa-layer-group"></i> Resumo de Probabilidades</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gt2" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Clube</th>
                <th>Título</th>
                <th>G4</th>
                <th>Z4</th>
                <th>Média Pts</th>
                <th>Média Pos</th>
              </tr>
            </thead>
            <tbody>
              {odds.map(o => (
                <tr key={o.team}>
                  <td style={{ fontSize: 10 }}>{o.team}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: o.titulo > 0 ? 'var(--ac)' : 'var(--mt)' }}>{o.titulo}%</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: 'var(--ob)' }}>{o.g4}%</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: o.z4 > 0 ? 'var(--dn)' : 'var(--mt)' }}>{o.z4}%</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif' }}>{o.mediaPts}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', color: 'var(--mt)' }}>{o.mediaPos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}