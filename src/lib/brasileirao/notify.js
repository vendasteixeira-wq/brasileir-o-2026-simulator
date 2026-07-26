// Notificacoes do navegador para conclusao do calculo de rodadas
export function notifyPermission() {
  return typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
}

export async function requestNotifyPermission() {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  try { return await Notification.requestPermission(); } catch (e) { return Notification.permission; }
}

export function notifyRoundFinished(roundIdx, count) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;
  try {
    const n = new Notification('Brasileirao 2026 — Rodada ' + roundIdx, {
      body: 'Calculo de previsao concluido: ' + count + ' partidas analisadas (Monte Carlo + Dixon-Coles).',
      tag: 'br-rodada-' + roundIdx
    });
    setTimeout(() => n.close(), 8000);
    return true;
  } catch (e) { return false; }
}