// Previsoes em lote por rodada (round-robin + Monte Carlo)
import { monteCarlo } from './predict';

// Circle method: distribui N times em N-1 rodadas de N/2 jogos.
export function roundRobin(teams) {
  const arr = [...teams];
  if (arr.length % 2) arr.push(null);
  const m = arr.length;
  const half = m / 2;
  const rounds = [];
  for (let r = 0; r < m - 1; r++) {
    const round = [];
    for (let i = 0; i < half; i++) {
      const a = arr[i], b = arr[m - 1 - i];
      if (a && b) round.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(round);
    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    arr.splice(0, m, fixed, ...rest);
  }
  return rounds;
}

// Roda Monte Carlo para cada jogo e devolve previsao compacta.
export function predictMatches(matches, iter = 2000) {
  return matches.map(([h, a]) => {
    const mc = monteCarlo(h, a, iter);
    const score = mc.top && mc.top[0] ? mc.top[0].score : '1-1';
    const fav = mc.win > mc.loss ? h : mc.loss > mc.win ? a : 'Empate';
    return { h, a, win: mc.win, draw: mc.draw, loss: mc.loss, xgH: mc.xgH, xgA: mc.xgA, score, fav };
  });
}