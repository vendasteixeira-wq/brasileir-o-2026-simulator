// Correções aprendidas pelo motor de previsão (persistidas no navegador)
const CKEY = 'br_pred_corr_v1';
const DEF = { homeAdv: 0.18, drawBias: 1, goalScale: 1, n: 0 };

export function defaultCorr() { return { ...DEF }; }
export function getCorrections() {
  try {
    const c = JSON.parse(localStorage.getItem(CKEY));
    if (c && typeof c.homeAdv === 'number') return c;
  } catch (e) { /* ignore */ }
  return { ...DEF };
}
export function setCorrections(c) {
  try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) { /* ignore */ }
}