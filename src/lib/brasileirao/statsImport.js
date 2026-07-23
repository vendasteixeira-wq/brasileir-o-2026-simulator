// Importador de estatisticas reais via CSV (exportado do Google Sheets)
import { setStatsOverride, getStatsOverride, clearStatsOverride } from './engine';

// Colunas reconhecidas (case-insensitive, varias formas PT/EN)
const ALIASES = {
  team: ['team', 'time', 'clube', 'club'],
  xG: ['xg', 'xg90', 'xg/90', 'expectedgoals', 'golosesperados'],
  xA: ['xa', 'xa90', 'xa/90', 'expectedassists'],
  goals: ['goals', 'gols', 'gf', 'golos', 'golfeitos'],
  conv: ['conv', 'conversion', 'conversao', 'conversão'],
  pas: ['pas', 'passcomp', 'passe', 'passe', 'passacc', 'passaccuracy'],
  ppda: ['ppda', 'pressao', 'pressão', 'pressure'],
  def: ['def', 'defense', 'defesa'],
  gk: ['gk', 'goleiro', 'keeper', 'goalkeeper'],
  atk: ['atk', 'attack', 'ataque'],
  mid: ['mid', 'midfield', 'meio', 'meiocampo'],
  injuries: ['injuries', 'lesoes', 'lesões', 'desfalques', 'injured', 'lesionados']
};

function norm(s) {
  return String(s || '').toLowerCase().trim().replace(/[/%º°.\s]/g, '');
}

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV vazio ou sem linhas de dados');
  const delim = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delim).map(norm);
  const colMap = {};
  Object.keys(ALIASES).forEach(key => {
    const idx = headers.findIndex(h => ALIASES[key].includes(h));
    if (idx >= 0) colMap[key] = idx;
  });
  if (colMap.team === undefined) throw new Error('Coluna "team/time" nao encontrada no cabecalho');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delim);
    const team = (cells[colMap.team] || '').trim();
    if (!team) continue;
    const row = { team };
    ['xG', 'xA', 'goals', 'conv', 'pas', 'ppda', 'def', 'gk', 'atk', 'mid', 'injuries'].forEach(k => {
      if (colMap[k] !== undefined && cells[colMap[k]] !== undefined) {
        const v = parseFloat(String(cells[colMap[k]]).replace(',', '.'));
        if (!isNaN(v)) row[k] = v;
      }
    });
    rows.push(row);
  }
  if (!rows.length) throw new Error('Nenhuma linha de time encontrada');
  return rows;
}

export function applyImport(rows) {
  const map = {};
  rows.forEach(r => {
    const { team, ...rest } = r;
    map[team] = rest;
  });
  setStatsOverride(map);
  return Object.keys(map);
}

export function getImported() { return getStatsOverride(); }
export function clearImport() { clearStatsOverride(); }