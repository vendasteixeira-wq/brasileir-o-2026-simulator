// Historico dos sorteios da Caixa (Mega Sena, Quina, Lotofacil) - ultimos 6 anos
// 3 fontes: baseline embutido (offline), busca ao vivo no site da Caixa (web search), cache no navegador
import { base44 } from '@/api/base44Client';

const CACHE_KEY = 'caixa_freq_v2';
const DAY_KEY = () => {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};

// Baseline aproximado (distribuicao realista media); substituido por dados ao vivo da Caixa
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

export async function fetchCaixaHistory() {
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
  const norm = {
    mega: d.mega.map(x => +x),
    quina: d.quina.map(x => +x),
    lotofacil: d.lotofacil.map(x => +x)
  };
  setFreqTable(norm, 'caixa');
  return norm;
}