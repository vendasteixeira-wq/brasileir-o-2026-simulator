// Relatórios de performance: simula a temporada completa (Dixon-Coles) e agrega
// tendências por rodada, probabilidades de título/G4/Z4 e o resumo consolidado dos clubes.
import { B20 } from './engine';
import { roundRobin, predictMatches } from './rodada';
import { dixonColesLambda, dixonColesGrid } from './predict';

const byTable = (a, b) =>
  b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp;

// 38 rodadas: turno + returno (mandos invertidos)
export function buildFixtures() {
  const first = roundRobin(B20);
  const second = first.map(r => r.map(([h, a]) => [a, h]));
  return [...first, ...second];
}

// Amostrador rápido de placar a partir da grade Dixon-Coles (cumulativa pré-calculada)
function makeSampler(home, away) {
  const { lambdaH, lambdaA } = dixonColesLambda(home, away);
  const grid = dixonColesGrid(lambdaH, lambdaA);
  const n = grid.length;
  const hs = new Int8Array(n);
  const as = new Int8Array(n);
  const cum = new Float64Array(n);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += grid[i].prob;
    cum[i] = acc;
    hs[i] = grid[i].h;
    as[i] = grid[i].a;
  }
  return () => {
    const r = Math.random() * acc;
    let i = 0;
    while (i < n - 1 && r > cum[i]) i++;
    return { h: hs[i], a: as[i] };
  };
}

export function buildSeasonReport(iterations = 250) {
  const fixtures = buildFixtures();
  const samplers = {};
  fixtures.forEach(round => round.forEach(([h, a]) => {
    const k = h + '|' + a;
    if (!samplers[k]) samplers[k] = makeSampler(h, a);
  }));

  const emptyTable = () => Object.fromEntries(B20.map(t => [t, {
    team: t, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, form: []
  }]));

  const cur = emptyTable();
  const trends = [];
  const positionsByRound = Object.fromEntries(B20.map(t => [t, []]));
  let totalGoals = 0, totalHome = 0, totalDraw = 0, totalAway = 0, totalGames = 0;

  // 1) Temporada de referência (uma amostra) → tabela, forma e tendências por rodada
  fixtures.forEach((matches, ri) => {
    let goals = 0, hw = 0, dr = 0, aw = 0;
    matches.forEach(([h, a]) => {
      const sc = samplers[h + '|' + a]();
      const H = cur[h], A = cur[a];
      H.j++; A.j++;
      H.gp += sc.h; H.gc += sc.a; A.gp += sc.a; A.gc += sc.h;
      goals += sc.h + sc.a;
      if (sc.h > sc.a) {
        hw++; H.v++; A.d++; H.pts += 3; H.form.push('V'); A.form.push('D');
      } else if (sc.h === sc.a) {
        dr++; H.e++; A.e++; H.pts++; A.pts++; H.form.push('E'); A.form.push('E');
      } else {
        aw++; A.v++; H.d++; A.pts += 3; A.form.push('V'); H.form.push('D');
      }
    });
    totalGoals += goals; totalHome += hw; totalDraw += dr; totalAway += aw; totalGames += matches.length;

    const sorted = Object.values(cur).sort(byTable);
    sorted.forEach((row, i) => positionsByRound[row.team].push(i + 1));

    const nm = matches.length || 1;
    trends.push({
      rodada: ri + 1,
      golsPorJogo: +(goals / nm).toFixed(2),
      vitoriaCasa: +(hw / nm * 100).toFixed(1),
      empate: +(dr / nm * 100).toFixed(1),
      vitoriaFora: +(aw / nm * 100).toFixed(1)
    });
  });

  // 2) Monte Carlo da temporada completa → probabilidades consolidadas
  const odds = Object.fromEntries(B20.map(t => [t, {
    team: t, titulo: 0, g4: 0, z4: 0, ptsSum: 0, posSum: 0
  }]));
  for (let it = 0; it < iterations; it++) {
    const t = Object.fromEntries(B20.map(x => [x, { pts: 0, gp: 0, gc: 0 }]));
    for (const round of fixtures) {
      for (const [h, a] of round) {
        const sc = samplers[h + '|' + a]();
        t[h].gp += sc.h; t[h].gc += sc.a;
        t[a].gp += sc.a; t[a].gc += sc.h;
        if (sc.h > sc.a) t[h].pts += 3;
        else if (sc.h === sc.a) { t[h].pts++; t[a].pts++; }
        else t[a].pts += 3;
      }
    }
    const sorted = Object.entries(t)
      .map(([team, v]) => ({ team, pts: v.pts, gp: v.gp, gc: v.gc }))
      .sort(byTable);
    sorted.forEach((row, i) => {
      const o = odds[row.team];
      o.ptsSum += row.pts;
      o.posSum += i + 1;
      if (i === 0) o.titulo++;
      if (i < 4) o.g4++;
      if (i >= sorted.length - 4) o.z4++;
    });
  }

  const oddsList = Object.values(odds).map(o => ({
    team: o.team,
    titulo: +(o.titulo / iterations * 100).toFixed(1),
    g4: +(o.g4 / iterations * 100).toFixed(1),
    z4: +(o.z4 / iterations * 100).toFixed(1),
    mediaPts: +(o.ptsSum / iterations).toFixed(1),
    mediaPos: +(o.posSum / iterations).toFixed(1)
  })).sort((a, b) => b.titulo - a.titulo || a.mediaPos - b.mediaPos);

  const table = Object.values(cur).sort(byTable).map((row, i) => ({
    ...row,
    pos: i + 1,
    sg: row.gp - row.gc,
    aprov: row.j ? +((row.pts / (row.j * 3)) * 100).toFixed(1) : 0,
    form: row.form.slice(-5)
  }));

  return {
    fixtures,
    trends,
    table,
    odds: oddsList,
    positionsByRound,
    summary: {
      rodadas: fixtures.length,
      jogos: totalGames,
      golsPorJogo: +(totalGoals / (totalGames || 1)).toFixed(2),
      vitoriaCasa: +(totalHome / (totalGames || 1) * 100).toFixed(1),
      empate: +(totalDraw / (totalGames || 1) * 100).toFixed(1),
      vitoriaFora: +(totalAway / (totalGames || 1) * 100).toFixed(1),
      iteracoes: iterations
    }
  };
}

// Probabilidades de vitória/empate/derrota dos jogos de uma rodada
export function roundProbabilities(fixtures, roundIndex) {
  const round = fixtures[roundIndex];
  if (!round) return [];
  return predictMatches(round, 1500);
}