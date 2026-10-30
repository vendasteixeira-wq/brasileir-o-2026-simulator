import { useEffect, useState } from 'react';
import { roundProbabilities } from '@/lib/brasileirao/perfReports';

export default function RoundProbabilities({ fixtures }) {
  const [round, setRound] = useState(1);
  const [preds, setPreds] = useState(null);

  useEffect(() => {
    setPreds(null);
    const t = setTimeout(() => setPreds(roundProbabilities(fixtures, round - 1)), 30);
    return () => clearTimeout(t);
  }, [round, fixtures]);

  return (
    <div className="pnl">
      <div className="pt" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span><i className="fas fa-dice"></i> Probabilidade de Vitória por Rodada</span>
        <select value={round} onChange={e => setRound(Number(e.target.value))} className="psr" style={{ width: 'auto', padding: '4px 8px' }}>
          {fixtures.map((_, i) => <option key={i} value={i + 1}>Rodada {i + 1}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5, marginBottom: 8 }}>
        Probabilidades de vitória, empate e derrota de cada confronto da rodada, com placar mais provável e favorito (Monte Carlo · Dixon-Coles).
      </div>

      {!preds ? (
        <div className="ild"><i className="fas fa-spinner fa-spin"></i> Calculando probabilidades...</div>
      ) : (
        <div className="pp-grid">
          {preds.map(p => (
            <div className="pp-card" key={p.h + p.a}>
              <div className="pp-head">
                <span className="pp-hm">{p.h}</span>
                <span className="pp-vs">vs</span>
                <span className="pp-aw">{p.a}</span>
              </div>
              <div className="pp-score" style={{ color: 'var(--oo)' }}>{p.score}</div>
              <div className="pp-hit-label">Placar mais provável · {p.hit}%</div>
              <div style={{ display: 'grid', gap: 3, margin: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 56, fontSize: 9, color: 'var(--mt)' }}>Casa</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--bd)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.win}%`, background: 'var(--hm)' }}></div>
                  </div>
                  <span style={{ width: 34, textAlign: 'right', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 10 }}>{p.win}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 56, fontSize: 9, color: 'var(--mt)' }}>Empate</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--bd)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.draw}%`, background: 'var(--ac2)' }}></div>
                  </div>
                  <span style={{ width: 34, textAlign: 'right', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 10 }}>{p.draw}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 56, fontSize: 9, color: 'var(--mt)' }}>Fora</span>
                  <div style={{ flex: 1, height: 5, background: 'var(--bd)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.loss}%`, background: 'var(--aw)' }}></div>
                  </div>
                  <span style={{ width: 34, textAlign: 'right', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 10 }}>{p.loss}%</span>
                </div>
              </div>
              <div className="pp-xg">xG {p.xgH} - {p.xgA} · Favorito: <b style={{ color: 'var(--ac)' }}>{p.fav}</b></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}