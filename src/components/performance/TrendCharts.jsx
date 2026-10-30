import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const GRID = '#1e2e44';
const TICK = { fill: '#5a7090', fontSize: 10 };
const TIP = {
  contentStyle: { background: '#131b28', border: '1px solid #1e2e44', borderRadius: 6, fontSize: 11, color: '#e0e8f0' },
  labelStyle: { color: '#29b6f6', fontSize: 11 }
};

export default function TrendCharts({ trends, teams, positionsByRound }) {
  const [team, setTeam] = useState(teams[0]);
  const posData = (positionsByRound[team] || []).map((p, i) => ({ rodada: i + 1, posicao: p }));

  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
      <div className="pnl" style={{ margin: 0 }}>
        <div className="pt"><i className="fas fa-chart-line"></i> Tendências ao Longo das Rodadas</div>
        <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5, marginBottom: 8 }}>
          Média por rodada simulada: gols por jogo, vitória do mandante, empates e vitória do visitante.
        </div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="rodada" tick={TICK} stroke={GRID} interval={5} />
              <YAxis tick={TICK} stroke={GRID} />
              <Tooltip {...TIP} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="golsPorJogo" name="Gols/jogo" stroke="#00e676" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="vitoriaCasa" name="Vitória casa %" stroke="#ff6d3a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="empate" name="Empates %" stroke="#ffd600" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="vitoriaFora" name="Vitória fora %" stroke="#40a0ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pnl" style={{ margin: 0 }}>
        <div className="pt"><i className="fas fa-arrows-alt-v"></i> Evolução da Posição por Clube</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <select
            value={team}
            onChange={e => setTeam(e.target.value)}
            className="psr"
            style={{ width: 'auto', minWidth: 160 }}
          >
            {teams.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{ fontSize: 10, color: 'var(--mt)' }}>1º acima · 20º abaixo</span>
        </div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={posData} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="rodada" tick={TICK} stroke={GRID} interval={5} />
              <YAxis tick={TICK} stroke={GRID} reversed domain={[1, teams.length]} ticks={[1, 5, 10, 15, 20]} />
              <Tooltip {...TIP} />
              <Line type="monotone" dataKey="posicao" name="Posição" stroke="#29b6f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}