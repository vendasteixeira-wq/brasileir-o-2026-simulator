// Modulo de previsao avancada: Elo + Dixon-Coles (Poisson Bivariado) + Monte Carlo
import { gts } from './engine';
import { getCorrections } from './corrections';

// === Elo: rating dinamico derivado do OVR do elenco ===
export function eloRating(ovr) {
  // 70 OVR = 1500 base; cada ponto de OVR vale ~40 Elo
  return 1500 + (ovr - 70) * 40;
}

export function eloWinProb(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

// === Forca de cada time a partir das metricas Opta ===
export function teamStrength(team) {
  const s = gts(team);
  const ovr = s.ovr;
  // Lesoes importadas reduzem forca (cada lesao ~4% no ataque, 2% cedidos; cap 30%/20%)
  const inj = s.injuries || 0;
  const injAtk = 1 - Math.min(0.3, inj * 0.04);
  const injDef = 1 + Math.min(0.2, inj * 0.02);
  // Ataque: xG real + bonus por qualidade do elenco
  const atk = Math.max(0.2, (s.xG * 1.15 + (ovr - 70) * 0.035 + 0.5) * injAtk);
  // Defesa: DEF + GK reduzem gols cedidos (maior def = menor taxa)
  const concede = Math.max(0.25, (1 - (s.def - 40) / 120) * (1 - (s.gk - 40) / 200) * 1.4 * injDef);
  return { atk, def: concede, elo: eloRating(ovr), ovr, injuries: inj };
}

// === Dixon-Coles: Poisson Bivariado com correcao de baixo placar ===
// Modela correlacao entre os times (0-0 e 1-1 sao mais comuns que Poisson puro prevê)
export function dixonColesLambda(home, away, homeAdv) {
  if (homeAdv === undefined) homeAdv = getCorrections().homeAdv;
  const h = teamStrength(home), a = teamStrength(away);
  const lambdaH = h.atk * a.def * (1 + homeAdv);
  const lambdaA = a.atk * h.def * (1 - homeAdv * 0.4);
  return { lambdaH, lambdaA };
}

export function poissonPMF(lambda, max = 8) {
  const p = [];
  let term = Math.exp(-lambda);
  p.push(term);
  for (let k = 1; k <= max; k++) { term *= lambda / k; p.push(term); }
  const sum = p.reduce((a, b) => a + b, 0);
  return p.map(x => x / sum);
}

export function dixonColesGrid(lambdaH, lambdaA, tau = 0.07) {
  const pH = poissonPMF(lambdaH), pA = poissonPMF(lambdaA);
  const grid = [];
  let total = 0;
  for (let i = 0; i < pH.length; i++) {
    for (let j = 0; j < pA.length; j++) {
      let corr = 1;
      if (i === 0 && j === 0) corr = 1 - tau * lambdaH * lambdaA;
      else if (i === 0 && j === 1) corr = 1 + tau * lambdaA;
      else if (i === 1 && j === 0) corr = 1 + tau * lambdaH;
      else if (i === 1 && j === 1) corr = 1 - tau;
      const prob = pH[i] * pA[j] * corr;
      grid.push({ h: i, a: j, prob });
      total += prob;
    }
  }
  grid.forEach(g => g.prob /= total);
  return grid;
}

function sampleGrid(grid) {
  const r = Math.random();
  let cum = 0;
  for (const g of grid) { cum += g.prob; if (r <= cum) return g; }
  return grid[grid.length - 1];
}

// === Monte Carlo: roda a partida N vezes, retorna distribuicao de resultados ===
export function monteCarlo(home, away, n = 3000) {
  const corr = getCorrections();
  const { lambdaH, lambdaA } = dixonColesLambda(home, away);
  const grid = dixonColesGrid(lambdaH * corr.goalScale, lambdaA * corr.goalScale);
  if (corr.drawBias !== 1) {
    let t = 0;
    grid.forEach(g => { if (g.h === g.a) g.prob *= corr.drawBias; t += g.prob; });
    grid.forEach(g => g.prob /= t);
  }
  const counts = { win: 0, draw: 0, loss: 0 };
  const scoreFreq = {};
  for (let i = 0; i < n; i++) {
    const g = sampleGrid(grid);
    const key = g.h + '-' + g.a;
    scoreFreq[key] = (scoreFreq[key] || 0) + 1;
    if (g.h > g.a) counts.win++;
    else if (g.h === g.a) counts.draw++;
    else counts.loss++;
  }
  const expH = grid.reduce((s, g) => s + g.h * g.prob, 0);
  const expA = grid.reduce((s, g) => s + g.a * g.prob, 0);
  const top = Object.entries(scoreFreq)
    .map(([k, v]) => ({ score: k, pct: v / n * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
  const ha = teamStrength(home), aa = teamStrength(away);
  return {
    win: +(counts.win / n * 100).toFixed(1),
    draw: +(counts.draw / n * 100).toFixed(1),
    loss: +(counts.loss / n * 100).toFixed(1),
    xgH: +expH.toFixed(2), xgA: +expA.toFixed(2),
    top,
    eloH: ha.elo, eloA: aa.elo,
    winProbH: +(eloWinProb(ha.elo, aa.elo) * 100).toFixed(1)
  };
}

// === Amostra unica de placar (para a partida rapida) ===
export function sampleScore(home, away) {
  const { lambdaH, lambdaA } = dixonColesLambda(home, away);
  const grid = dixonColesGrid(lambdaH, lambdaA);
  const g = sampleGrid(grid);
  return { h: g.h, a: g.a, lambdaH, lambdaA };
}