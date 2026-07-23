// Dados reais da classificacao Brasileirao 2026 (apos 19 rodadas)
// Fonte: tabela oficial do usuario. O override injeta a performance real
// (pontos por jogo, gols marcados/sofridos por jogo) no motor de previsao,
// substituindo as estimativas baseadas em atributos de jogador.
// Nomes dos times devem bater com os usados no engine (B20).

export const REAL_TABLE = [
  { team: 'Palmeiras',      pts: 44, pj: 19, gm: 33, gc: 14 },
  { team: 'Flamengo',       pts: 37, pj: 18, gm: 35, gc: 16 },
  { team: 'Athletico-PR',   pts: 33, pj: 19, gm: 26, gc: 19 },
  { team: 'Fluminense',     pts: 32, pj: 19, gm: 29, gc: 24 },
  { team: 'Bragantino',     pts: 30, pj: 19, gm: 26, gc: 20 },
  { team: 'Bahia',          pts: 30, pj: 19, gm: 28, gc: 24 },
  { team: 'Corinthians',    pts: 27, pj: 19, gm: 19, gc: 19 },
  { team: 'Cruzeiro',       pts: 27, pj: 19, gm: 26, gc: 29 },
  { team: 'Botafogo',       pts: 28, pj: 19, gm: 33, gc: 32 },
  { team: 'Coritiba',       pts: 28, pj: 19, gm: 25, gc: 27 },
  { team: 'Vitória',        pts: 28, pj: 19, gm: 22, gc: 25 },
  { team: 'São Paulo',      pts: 25, pj: 19, gm: 24, gc: 22 },
  { team: 'Atlético-MG',    pts: 25, pj: 19, gm: 23, gc: 24 },
  { team: 'Internacional',  pts: 21, pj: 19, gm: 22, gc: 24 },
  { team: 'Santos',         pts: 21, pj: 19, gm: 27, gc: 31 },
  { team: 'Grêmio',         pts: 21, pj: 19, gm: 21, gc: 25 },
  { team: 'Vasco',          pts: 20, pj: 19, gm: 22, gc: 30 },
  { team: 'Mirassol',       pts: 18, pj: 18, gm: 20, gc: 25 },
  { team: 'Remo',           pts: 18, pj: 19, gm: 21, gc: 30 },
  { team: 'Chapecoense',    pts:  8, pj: 19, gm: 17, gc: 39 }
];

// Converte a tabela real em override de estatisticas:
// - ovr: derivado de pontos por jogo (forma real)
// - xG: gols marcados por jogo
// - def / gk: derivados de gols sofridos por jogo (menos GC = defesa melhor)
// - atk / mid: derivados de gols marcados
export function buildRealOverride() {
  const map = {};
  REAL_TABLE.forEach(r => {
    const ppg = r.pts / r.pj;
    const gmg = r.gm / r.pj;
    const gcg = r.gc / r.pj;
    const def = Math.round(88 - gcg * 18);
    const atk = Math.round(50 + gmg * 20);
    map[r.team] = {
      ovr: Math.round(48 + ppg * 16),
      xG: +gmg.toFixed(2),
      def,
      gk: def + 1,
      atk,
      mid: Math.round((atk + def) / 2)
    };
  });
  return map;
}