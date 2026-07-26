// Exportacao de historico (simulacoes + loteria) para CSV/planilha offline
import { base44 } from '@/api/base44Client';
import { getHistory } from './learning';

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(cell => {
    const s = cell == null ? '' : String(cell);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportSimHistoryCSV() {
  const hist = getHistory();
  if (!hist.length) return false;
  const rows = [['rodada', 'casa', 'fora', 'pred_vit_casa_pct', 'pred_empate_pct', 'pred_vit_fora_pct', 'pred_xg_casa', 'pred_xg_fora', 'gols_casa_real', 'gols_fora_real', 'resultado_real']];
  hist.forEach((r, i) => rows.push([
    i + 1, r.h, r.a, r.pred.win, r.pred.draw, r.pred.loss,
    r.pred.xgH, r.pred.xgA, r.act.h, r.act.a, r.act.outcome
  ]));
  downloadCSV('simulacoes_historico.csv', rows);
  return true;
}

export async function exportLotteryCSV() {
  let draws = [];
  try { draws = await base44.entities.LotteryDraw.list('-draw_no', 10000) || []; } catch (e) { draws = []; }
  if (!draws.length) return false;
  const rows = [['modalidade', 'concurso', 'data', 'numeros', 'soma', 'impares']];
  draws.forEach(d => rows.push([
    d.modality, d.draw_no, d.draw_date || '',
    (d.numbers || []).join('-'), d.sum != null ? d.sum : '', d.odd_count != null ? d.odd_count : ''
  ]));
  downloadCSV('loteria_historico.csv', rows);
  return true;
}

export async function exportAllCSV() {
  const sim = exportSimHistoryCSV();
  const lot = await exportLotteryCSV();
  return { sim, lot };
}