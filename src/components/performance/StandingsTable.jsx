const formColor = c => c === 'V' ? 'var(--ac)' : c === 'E' ? 'var(--ac2)' : 'var(--dn)';

export default function StandingsTable({ table }) {
  return (
    <div className="pnl">
      <div className="pt"><i className="fas fa-table"></i> Resumo Consolidado dos Clubes</div>
      <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5, marginBottom: 8 }}>
        Classificação da temporada simulada (38 rodadas): pontos, aproveitamento, saldo de gols e forma nos últimos 5 jogos.
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="gt2" style={{ width: '100%', minWidth: 620 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>#</th>
              <th style={{ textAlign: 'left' }}>Clube</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GP</th>
              <th>GC</th>
              <th>SG</th>
              <th>Pts</th>
              <th>Aprov.</th>
              <th>Últimos 5</th>
            </tr>
          </thead>
          <tbody>
            {table.map(r => (
              <tr key={r.team}>
                <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: r.pos <= 4 ? 'var(--ac)' : r.pos > table.length - 4 ? 'var(--dn)' : 'var(--mt)' }}>{r.pos}</td>
                <td style={{ fontSize: 10 }}>{r.team}</td>
                <td style={{ textAlign: 'center' }}>{r.j}</td>
                <td style={{ textAlign: 'center', color: 'var(--ac)' }}>{r.v}</td>
                <td style={{ textAlign: 'center', color: 'var(--ac2)' }}>{r.e}</td>
                <td style={{ textAlign: 'center', color: 'var(--mt)' }}>{r.d}</td>
                <td style={{ textAlign: 'center' }}>{r.gp}</td>
                <td style={{ textAlign: 'center' }}>{r.gc}</td>
                <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', color: r.sg > 0 ? 'var(--ac)' : r.sg < 0 ? 'var(--dn)' : 'var(--mt)' }}>
                  {r.sg > 0 ? '+' : ''}{r.sg}
                </td>
                <td className="pts" style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 12 }}>{r.pts}</td>
                <td style={{ textAlign: 'center', fontFamily: 'Rajdhani,sans-serif', color: r.aprov >= 60 ? 'var(--ac)' : r.aprov < 40 ? 'var(--dn)' : 'var(--ac2)' }}>{r.aprov}%</td>
                <td>
                  <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {r.form.map((c, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 15, height: 15, borderRadius: 3,
                        background: formColor(c), color: '#0b1016',
                        fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 9
                      }}>{c}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 9, color: 'var(--mt)', marginTop: 6, borderTop: '1px solid var(--bd)', paddingTop: 5 }}>
        <i className="fas fa-info-circle"></i> Verde = zona de título/G4 · Vermelho = zona de rebaixamento (Z4).
      </div>
    </div>
  );
}