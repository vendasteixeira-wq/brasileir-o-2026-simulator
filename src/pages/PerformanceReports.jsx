import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '@/brasileirao.css';
import { buildSeasonReport } from '@/lib/brasileirao/perfReports';
import TrendCharts from '@/components/performance/TrendCharts';
import OddsPanel from '@/components/performance/OddsPanel';
import RoundProbabilities from '@/components/performance/RoundProbabilities';
import StandingsTable from '@/components/performance/StandingsTable';

const CARDS = [
  { key: 'rodadas', label: 'Rodadas', suf: '', col: 'var(--ob)' },
  { key: 'jogos', label: 'Jogos simulados', suf: '', col: 'var(--ac2)' },
  { key: 'golsPorJogo', label: 'Gols por jogo', suf: '', col: 'var(--ac)' },
  { key: 'vitoriaCasa', label: 'Vitória mandante', suf: '%', col: 'var(--hm)' },
  { key: 'empate', label: 'Empates', suf: '%', col: 'var(--ac2)' },
  { key: 'vitoriaFora', label: 'Vitória visitante', suf: '%', col: 'var(--aw)' }
];

export default function PerformanceReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    document.body.classList.add('br-page');
    const t = setTimeout(() => setReport(buildSeasonReport(250)), 30);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('br-page');
    };
  }, []);

  return (
    <div className="br-app">
      <header className="hdr">
        <div className="logo">
          <i className="fas fa-chart-line"></i>
          <h1>RELATÓRIOS DE PERFORMANCE</h1>
        </div>
        <Link
          to="/"
          style={{
            padding: '4px 10px', borderRadius: 6, background: 'rgba(0,230,118,.1)',
            border: '1px solid var(--ac)', color: 'var(--ac)', textDecoration: 'none',
            fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 11,
            display: 'inline-flex', alignItems: 'center', gap: 5
          }}
        >
          <i className="fas fa-arrow-left"></i> Simulador
        </Link>
      </header>

      {!report ? (
        <div className="pnl">
          <div className="ild"><i className="fas fa-spinner fa-spin"></i> Simulando a temporada completa e calculando probabilidades...</div>
        </div>
      ) : (
        <>
          <div className="pnl">
            <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}>
              {CARDS.map(c => (
                <div key={c.key} style={{ background: 'var(--cd2)', border: '1px solid var(--bd)', borderRadius: 6, padding: '7px 9px' }}>
                  <div style={{ fontSize: 9, color: 'var(--mt)' }}>{c.label}</div>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 20, fontWeight: 700, color: c.col }}>
                    {report.summary[c.key]}{c.suf}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: 'var(--mt)', marginTop: 7, lineHeight: 1.5 }}>
              <i className="fas fa-info-circle"></i> Base: {report.summary.jogos} jogos simulados em {report.summary.rodadas} rodadas ·
              modelo Dixon-Coles com Elo e Monte Carlo ({report.summary.iteracoes} temporadas completas para as probabilidades).
            </div>
          </div>

          <TrendCharts
            trends={report.trends}
            teams={report.table.map(r => r.team)}
            positionsByRound={report.positionsByRound}
          />

          <OddsPanel odds={report.odds} />

          <RoundProbabilities fixtures={report.fixtures} />

          <StandingsTable table={report.table} />
        </>
      )}
    </div>
  );
}