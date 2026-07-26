// Aprendizado do motor de previsao: compara previsoes (Monte Carlo + Elo + Dixon-Coles)
// com resultados simulados, calcula calibracao/Brier/vies e aprende correcoes aplicadas nas proximas previsoes
import { monteCarlo } from './predict';
import { Sim } from './engine';
import { B20 } from './engine';
import { getCorrections, setCorrections, defaultCorr } from './corrections';

const HKEY = 'br_pred_history_v1';

function loadHist() { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } }
function saveHist(a) { try { localStorage.setItem(HKEY, JSON.stringify(a.slice(-200))); } catch (e) { /* ignore */ } }

function headlessCanvas() {
  const c = document.createElement('canvas');
  c.width = 1050; c.height = 680;
  return c;
}

// Resultado "real" via simulador independente (Poisson + fisica), sem renderizar
function quickOutcome(h, a) {
  const sim = new Sim(headlessCanvas(), h, a);
  sim.quickSim();
  return { h: sim.sc2.h, a: sim.sc2.a, xgH: sim.xg.h, xgA: sim.xg.a };
}

export function runCalibration(matchups) {
  const recs = [];
  for (const m of matchups) {
    const h = m.h || m[0], a = m.a || m[1];
    if (!h || !a || h === a) continue;
    const pred = monteCarlo(h, a, 1500);
    const act = quickOutcome(h, a);
    const outcome = act.h > act.a ? 'W' : act.h === act.a ? 'D' : 'L';
    recs.push({
      h, a,
      pred: { win: pred.win, draw: pred.draw, loss: pred.loss, xgH: pred.xgH, xgA: pred.xgA },
      act: { h: act.h, a: act.a, outcome },
      ts: Date.now()
    });
  }
  const all = loadHist().concat(recs);
  saveHist(all);
  learnFromHistory(all);
  return { recs, metrics: computeMetrics(all), corrections: getCorrections() };
}

export function computeMetrics(recs) {
  if (!recs || !recs.length) return null;
  let correct = 0, brier = 0, n = recs.length;
  let predDraw = 0, actDraw = 0, predHome = 0, actHome = 0, predGoals = 0, actGoals = 0;
  recs.forEach(r => {
    const fav = r.pred.win >= r.pred.draw && r.pred.win >= r.pred.loss ? 'W'
      : r.pred.draw >= r.pred.loss ? 'D' : 'L';
    if (fav === r.act.outcome) correct++;
    const pW = r.pred.win / 100, pD = r.pred.draw / 100, pL = r.pred.loss / 100;
    brier += (pW - (r.act.outcome === 'W' ? 1 : 0)) ** 2
      + (pD - (r.act.outcome === 'D' ? 1 : 0)) ** 2
      + (pL - (r.act.outcome === 'L' ? 1 : 0)) ** 2;
    predDraw += pD; if (r.act.outcome === 'D') actDraw++;
    predHome += pW; if (r.act.outcome === 'W') actHome++;
    predGoals += r.pred.xgH + r.pred.xgA; actGoals += r.act.h + r.act.a;
  });
  return {
    n, accuracy: +(correct / n * 100).toFixed(1), brier: +(brier / n).toFixed(3),
    predDrawRate: +(predDraw / n * 100).toFixed(1), actDrawRate: +(actDraw / n * 100).toFixed(1),
    predHomeRate: +(predHome / n * 100).toFixed(1), actHomeRate: +(actHome / n * 100).toFixed(1),
    predGoals: +(predGoals / n).toFixed(2), actGoals: +(actGoals / n).toFixed(2)
  };
}

export function getMetrics() { return computeMetrics(loadHist()); }
export function getHistory() { return loadHist(); }

export function learnFromHistory(recs) {
  recs = recs || loadHist();
  if (recs.length < 5) return getCorrections();
  const m = computeMetrics(recs);
  const homeAdv = Math.max(0.02, Math.min(0.45, 0.18 * (m.actHomeRate || 40) / (m.predHomeRate || 40)));
  const drawBias = Math.max(0.7, Math.min(1.4, (m.actDrawRate || 25) / (m.predDrawRate || 25)));
  const goalScale = Math.max(0.7, Math.min(1.4, m.actGoals / (m.predGoals || 2.4)));
  const corr = { homeAdv: +homeAdv.toFixed(3), drawBias: +drawBias.toFixed(3), goalScale: +goalScale.toFixed(3), n: recs.length };
  setCorrections(corr);
  return corr;
}

export function clearHistory() {
  saveHist([]);
  setCorrections(defaultCorr());
}

export { B20 };