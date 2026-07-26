// Historico dos sorteios da Caixa (Mega Sena, Quina, Lotofacil) - ultimos 6 anos
// Fonte primaria: sorteios REAIS via API da Caixa, armazenados no banco LotteryDraw.
// Fallback: frequencias agregadas via busca web (LLM). Cache local por dia.
import { base44 } from '@/api/base44Client';

const CACHE_KEY = 'caixa_freq_v2';
const DAY_KEY = () => {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};

const RANGES = { mega: 60, quina: 80, lotofacil: 25 };
const MODS = ['mega', 'quina', 'lotofacil'];
// Amostra ~6 anos: count sorteios amostrados com stride por modalidade (cadencia distinta)
const COUNT = 40;
const STRIDE = { mega: 16, quina: 47, lotofacil: 47 };

// Baseline aproximado (offline); substituido por dados reais ao buscar
function baseline(mean, n, seed) {
  let s = seed | 0;
  const rng = () => { s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(Math.round(mean * (0.7 + rng() * 0.6)));
  return arr;
}

export const BASELINE = {
  mega: baseline(62, 60, 20260726),
  quina: baseline(117, 80, 20260727),
  lotofacil: baseline(1860, 25, 20260728)
};

export function getFreqTable(mod) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const c = JSON.parse(raw);
      if (c.day === DAY_KEY() && c[mod] && c[mod].length) {
        return { table: c[mod], source: c.source || 'caixa' };
      }
    }
  } catch (e) { /* ignore */ }
  return { table: BASELINE[mod], source: 'baseline' };
}

export function setFreqTable(data, source) {
  const c = { day: DAY_KEY(), source: source || 'caixa', mega: data.mega, quina: data.quina, lotofacil: data.lotofacil };
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch (e) { /* ignore */ }
}

function validArr(a, n) {
  if (!Array.isArray(a) || a.length !== n) return false;
  return a.every(x => Number.isFinite(+x));
}

// Frequencia ponderada por recencia: sorteios mais recentes pesam mais (quentes recentes)
export function freqFromDraws(draws, range) {
  const sorted = [...draws].sort((a, b) => a.draw_no - b.draw_no);
  const n = sorted.length;
  const freq = new Array(range).fill(0);
  sorted.forEach((d, i) => {
    const w = 1 + 0.6 * (i / Math.max(1, n - 1));
    (d.numbers || []).forEach(num => { if (num >= 1 && num <= range) freq[num - 1] += w; });
  });
  return freq.map(Math.round);
}

async function storeAndCompute(mod, draws) {
  const range = RANGES[mod];
  const existing = await base44.entities.LotteryDraw.filter({ modality: mod }, '-draw_no', 5000);
  const seen = new Set(existing.map(d => d.draw_no));
  const fresh = draws
    .filter(d => d && d.draw_no && !seen.has(d.draw_no))
    .map(d => {
      const nums = (d.numbers || []).filter(n => Number.isFinite(n));
      return {
        modality: mod,
        draw_no: d.draw_no,
        draw_date: d.date || '',
        numbers: nums,
        sum: nums.reduce((a, b) => a + b, 0),
        odd_count: nums.filter(n => n % 2).length
      };
    });
  if (fresh.length) await base44.entities.LotteryDraw.bulkCreate(fresh);
  const all = existing.concat(fresh);
  return { table: freqFromDraws(all, range), count: all.length };
}

// Fallback: frequencias agregadas via busca web (LLM)
async function fetchCaixaHistoryLLM() {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Voce e um analista de loterias da Caixa. Com base no historico REAL dos ultimos 6 anos de sorteios disponivel na web (site da Caixa e sites de estatistica de loteria), retorne a FREQUENCIA (numero de vezes sorteada) de cada dezena para as tres modalidades. Mega Sena: dezenas 1 a 60 (array de 60 inteiros, indice 0 = dezena 1). Quina: dezenas 1 a 80 (array de 80 inteiros). Lotofacil: dezenas 1 a 25 (array de 25 inteiros). Use dados reais e atuais dos ultimos 6 anos. Retorne JSON exato: {"mega":[60 ints],"quina":[80 ints],"lotofacil":[25 ints]}.`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        mega: { type: 'array', items: { type: 'integer' } },
        quina: { type: 'array', items: { type: 'integer' } },
        lotofacil: { type: 'array', items: { type: 'integer' } }
      }
    }
  });
  const d = typeof res === 'string' ? JSON.parse(res) : res;
  if (!validArr(d.mega, 60) || !validArr(d.quina, 80) || !validArr(d.lotofacil, 25)) {
    throw new Error('Resposta da Caixa invalida');
  }
  const norm = { mega: d.mega.map(x => +x), quina: d.quina.map(x => +x), lotofacil: d.lotofacil.map(x => +x) };
  setFreqTable(norm, 'caixa');
  return norm;
}

// Busca sorteios REAIS via API da Caixa -> armazena no banco LotteryDraw -> tabela ponderada por recencia
export async function fetchCaixaHistory() {
  try {
    const res = await Promise.all(MODS.map(async mod => {
      const r = await base44.functions.invoke('fetchLotteryDraws', { modality: mod, count: COUNT, stride: STRIDE[mod] });
      const data = r.data || r;
      const draws = (data && data.draws) || [];
      return storeAndCompute(mod, draws);
    }));
    if (res.every(r => r.count === 0)) throw new Error('sem sorteios');
    const norm = { mega: res[0].table, quina: res[1].table, lotofacil: res[2].table };
    setFreqTable(norm, 'caixa-db');
    return norm;
  } catch (e) {
    return await fetchCaixaHistoryLLM();
  }
}

export async function getStoredCount(mod) {
  try { return await base44.entities.LotteryDraw.filter({ modality: mod }, '-draw_no', 5000); }
  catch (e) { return []; }
}