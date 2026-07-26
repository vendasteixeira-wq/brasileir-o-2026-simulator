// Ranking detalhado de técnicos do Brasileirão 2026 + análise tática online (via busca web LLM).
// Pilares: Eficácia Tática, Organização em Campo, Desempenho Real da Escalação.
import { base44 } from '@/api/base44Client';
import { B20 } from './engine';

export const CATS = [
  { k: 'tactica', label: 'Tática', icon: 'fa-chess', pillar: 'eficacia' },
  { k: 'inovacao', label: 'Inovação', icon: 'fa-lightbulb', pillar: 'eficacia' },
  { k: 'tecnica', label: 'Técnica', icon: 'fa-wrench', pillar: 'eficacia' },
  { k: 'organizacao', label: 'Organização', icon: 'fa-sitemap', pillar: 'organizacao' },
  { k: 'reorganizacao', label: 'Reorganização', icon: 'fa-sync-alt', pillar: 'organizacao' },
  { k: 'selecao', label: 'Seleção', icon: 'fa-list-ol', pillar: 'desempenho' },
  { k: 'escalacao', label: 'Desempenho Escalação', icon: 'fa-clipboard-check', pillar: 'desempenho' }
];

export const PILLARS = [
  { k: 'eficacia', label: 'Eficácia Tática', icon: 'fa-chess', hint: 'Sistema, inovação e técnica' },
  { k: 'organizacao', label: 'Organização em Campo', icon: 'fa-sitemap', hint: 'Estrutura defensiva e reação' },
  { k: 'desempenho', label: 'Desempenho da Escalação', icon: 'fa-clipboard-check', hint: 'Resultados reais e rotação' }
];

let coaches = null;
let lastFetched = null;
let sortKey = 'overall';

export function getCoaches() { return coaches; }

export function pillarScore(c, k) {
  const cs = CATS.filter(x => x.pillar === k).map(x => c[x.k] || 0);
  let s = cs.reduce((a, b) => a + b, 0) / cs.length;
  if (k === 'desempenho' && c.ppg != null) s = s * 0.6 + Math.min(100, (c.ppg / 3) * 100) * 0.4;
  return +s.toFixed(1);
}

export function scoreCoach(c) {
  const s = PILLARS.reduce((a, p) => a + pillarScore(c, p.k), 0);
  return +(s / PILLARS.length).toFixed(1);
}

export async function fetchCoaches() {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um analista de futebol especializado em treinadores. Liste os 20 técnicos (head coaches) atuais do Campeonato Brasileiro Série A 2026 (times: ${B20.join(', ')}). Para cada técnico, atribua notas de 0 a 100 em 7 categorias: tactica (sistema tático e estilo de jogo), inovacao (inovações e ideias modernas), tecnica (treino técnico e jogadas ensaiadas), organizacao (organização defensiva e estrutura em campo), selecao (escolha de titulares e rotação de elenco), escalacao (desempenho da escalação e resultados em campo), reorganizacao (capacidade de reorganizar o time e reagir durante jogos). Informe também o DESEMPENHO REAL da equipe sob o técnico: ppg (pontos por jogo, 0-3), j (jogos no comando), v (vitórias), e (empates), d (derrotas), gf (gols pró), ga (gols contra), form (últimos 5 resultados como string de V/E/D), last5pts (pontos nos últimos 5). Informe o clube, a formação base (ex: 4-3-3) e um resumo tático curto (até 120 caracteres). Use dados reais e atuais de GE/Globo Esporte, ESPN, UOL.`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        coaches: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              club: { type: 'string' },
              formation: { type: 'string' },
              tactica: { type: 'number' },
              inovacao: { type: 'number' },
              tecnica: { type: 'number' },
              organizacao: { type: 'number' },
              selecao: { type: 'number' },
              escalacao: { type: 'number' },
              reorganizacao: { type: 'number' },
              ppg: { type: 'number' },
              j: { type: 'number' },
              v: { type: 'number' },
              e: { type: 'number' },
              d: { type: 'number' },
              gf: { type: 'number' },
              ga: { type: 'number' },
              form: { type: 'string' },
              last5pts: { type: 'number' },
              summary: { type: 'string' }
            }
          }
        }
      }
    }
  });
  const data = typeof res === 'string' ? JSON.parse(res) : res;
  coaches = (data.coaches || []).map(c => ({
    ...c,
    ppg: c.ppg != null ? +c.ppg.toFixed(2) : null,
    eficacia: pillarScore(c, 'eficacia'),
    organizacao: pillarScore(c, 'organizacao'),
    desempenho: pillarScore(c, 'desempenho'),
    overall: scoreCoach(c)
  })).sort((a, b) => b.overall - a.overall);
  lastFetched = new Date();
  return coaches;
}

export async function analyzeCoach(name) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um analista tático de futebol. Faça uma análise detalhada do treinador ${name} (Brasileirão 2026) cobrindo: (1) eficácia tática e estilo de jogo (sistema, posse, transições); (2) inovações e ideias modernas; (3) técnicas de treino e jogadas ensaiadas; (4) organização defensiva e estrutura em campo; (5) seleção de titulares e rotação; (6) desempenho real da escalação e resultados recentes; (7) reorganização do time durante jogos e reações. Use dados reais e atuais de GE/Globo, ESPN, UOL. Retorne JSON com cada dimensão como texto descritivo (até 220 caracteres) e uma síntese geral (overall_text até 320 caracteres).`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        tactica: { type: 'string' },
        inovacao: { type: 'string' },
        tecnica: { type: 'string' },
        organizacao: { type: 'string' },
        selecao: { type: 'string' },
        escalacao: { type: 'string' },
        reorganizacao: { type: 'string' },
        overall_text: { type: 'string' }
      }
    }
  });
  return typeof res === 'string' ? JSON.parse(res) : res;
}

function rankColor(o) {
  return o >= 80 ? 'var(--ac)' : o >= 70 ? 'var(--ac2)' : o >= 60 ? 'var(--oo)' : 'var(--dn)';
}

function catBar(label, v, icon) {
  const col = v >= 80 ? 'var(--ac)' : v >= 65 ? 'var(--ac2)' : v >= 50 ? 'var(--oo)' : 'var(--dn)';
  return `<div style="margin-bottom:3px">
    <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif;margin-bottom:1px"><span><i class="fas ${icon}" style="font-size:8px;margin-right:3px"></i>${label}</span><b style="color:${col};font-family:Rajdhani,sans-serif">${v}</b></div>
    <div style="height:5px;background:var(--bd);border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.min(100, v)}%;background:${col}"></div></div>
  </div>`;
}

function fChips(s) {
  return (s || '').split('').map(c => {
    const col = c === 'V' ? 'var(--ac)' : c === 'E' ? 'var(--ac2)' : 'var(--dn)';
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:3px;background:${col};color:#0b1016;font-weight:700;font-size:8px;font-family:Rajdhani,sans-serif;margin:0 1px">${c}</span>`;
  }).join('');
}

function cellScore(v) {
  const col = rankColor(v);
  return `<td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:${col}">${v.toFixed(0)}<div style="height:4px;background:var(--bd);border-radius:2px;overflow:hidden;margin-top:2px"><div style="height:100%;width:${Math.min(100, v)}%;background:${col}"></div></div></td>`;
}

function sortCoaches() {
  if (!coaches) return;
  const key = sortKey;
  coaches.sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name);
    if (key === 'ppg' || key === 'last5pts') return (b[key] || 0) - (a[key] || 0);
    return (b[key] || b.overall) - (a[key] || a.overall);
  });
}

function renderTable(container) {
  const tbl = container.querySelector('#coachTable');
  const head = (k, label, hint) => `<th data-sort="${k}" style="cursor:pointer;text-align:center;${sortKey === k ? 'color:var(--ac)' : ''}" title="${hint}">${label}${sortKey === k ? ' <i class="fas fa-sort-down"></i>' : ''}</th>`;
  tbl.innerHTML = `<div style="overflow-x:auto"><table class="gt2" style="width:100%;font-size:10px">
    <tr>
      <th style="text-align:center">#</th>
      <th data-sort="name" style="cursor:pointer;text-align:left">Técnico / Clube${sortKey === 'name' ? ' <i class="fas fa-sort-down"></i>' : ''}</th>
      ${head('eficacia', 'Eficácia Tática', 'Sistema + inovação + técnica')}
      ${head('organizacao', 'Organização em Campo', 'Estrutura + reação')}
      ${head('desempenho', 'Desempenho Escalação', 'Resultados reais + rotação')}
      ${head('ppg', 'Pts/J', 'Pontos por jogo')}
      <th style="text-align:center">Últimos 5</th>
      <th style="text-align:center">V/E/D</th>
      ${head('overall', 'Overall', 'Média dos pilares')}
    </tr>
    ${coaches.map((c, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
      const oCol = rankColor(c.overall);
      return `<tr style="border-bottom:1px solid var(--bd)">
        <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700">${medal}</td>
        <td><div style="font-family:Rajdhani,sans-serif;font-weight:700;color:var(--tx)">${c.name}</div><div style="font-size:9px;color:var(--ob)">${c.club} · ${c.formation || '-'}</div></td>
        ${cellScore(c.eficacia)}
        ${cellScore(c.organizacao)}
        ${cellScore(c.desempenho)}
        <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:var(--ac)">${c.ppg != null ? c.ppg.toFixed(2) : '-'}</td>
        <td style="text-align:center">${fChips(c.form)}</td>
        <td style="text-align:center;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif">${c.v || 0}/${c.e || 0}/${c.d || 0}${c.gf != null ? ` · ${c.gf}-${c.ga}` : ''}</td>
        <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:${oCol};font-size:13px">${c.overall}</td>
      </tr>`;
    }).join('')}
  </table></div>
  <div style="font-size:9px;color:var(--mt);margin-top:5px"><i class="fas fa-info-circle"></i> Clique nos cabeçalhos para ordenar. Pilares agregam as 7 categorias; "Desempenho Escalação" pondera resultados reais (pts/jogo). Overall = média dos pilares.</div>`;
  tbl.querySelectorAll('[data-sort]').forEach(th => th.addEventListener('click', () => {
    sortKey = th.dataset.sort;
    sortCoaches();
    renderTable(container);
    renderCards(container);
  }));
}

function renderCards(container) {
  const cards = container.querySelector('#coachRank');
  cards.innerHTML = coaches.map((c, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    const oCol = rankColor(c.overall);
    const pRow = (p) => {
      const v = pillarScore(c, p.k);
      const col = rankColor(v);
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
        <span style="font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif"><i class="fas ${p.icon}" style="margin-right:3px"></i>${p.label}</span>
        <b style="color:${col};font-family:Rajdhani,sans-serif;font-size:11px">${v.toFixed(0)}</b>
      </div>`;
    };
    return `<div class="pp-card" style="position:relative">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
        <div>
          <div style="font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700">${medal}</div>
          <div style="font-size:13px;font-family:Rajdhani,sans-serif;font-weight:700;color:var(--tx)">${c.name}</div>
          <div style="font-size:10px;color:var(--ob);font-family:Rajdhani,sans-serif;font-weight:700">${c.club} · ${c.formation || '-'}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:22px;font-family:Rajdhani,sans-serif;font-weight:700;color:${oCol};line-height:1">${c.overall}</div>
          <div style="font-size:8px;color:var(--mt);font-family:Rajdhani,sans-serif">OVERALL</div>
        </div>
      </div>
      ${PILLARS.map(pRow).join('')}
      <div style="border-top:1px solid var(--bd);margin:4px 0;padding-top:3px">${CATS.map(x => catBar(x.label, c[x.k] || 0, x.icon)).join('')}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif;margin-bottom:4px">
        <span>Pts/J: <b style="color:var(--ac)">${c.ppg != null ? c.ppg.toFixed(2) : '-'}</b></span>
        <span>Últimos 5: ${fChips(c.form)} (${c.last5pts != null ? c.last5pts + 'pts' : '-'})</span>
      </div>
      <div style="font-size:10px;color:var(--mt);line-height:1.4;border-top:1px solid var(--bd);padding-top:4px">${c.summary || ''}</div>
      <button data-coach="${c.name}" style="margin-top:6px;width:100%;padding:5px;background:rgba(99,102,241,.12);border:1px solid #6366f1;color:#818cf8;border-radius:5px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px"><i class="fas fa-microscope"></i> Analisar Tática</button>
    </div>`;
  }).join('');
  cards.querySelectorAll('[data-coach]').forEach(b => b.addEventListener('click', () => onAnalyze(b.dataset.coach)));
}

function renderRank(container) {
  if (!coaches || !coaches.length) {
    container.querySelector('#coachTable').innerHTML = '';
    container.querySelector('#coachRank').innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px">Nenhum técnico carregado.</div>';
    return;
  }
  sortCoaches();
  renderTable(container);
  renderCards(container);
}

async function onAnalyze(name) {
  const box = document.querySelector('#coachAna');
  box.innerHTML = `<div class="lpnl"><div class="lhd"><i class="fas fa-microscope"></i> Análise tática — ${name}</div><div style="color:var(--mt);font-size:11px;padding:8px"><i class="fas fa-spinner fa-spin"></i> Analisando eficácia tática, organização e desempenho online...</div></div>`;
  try {
    const a = await analyzeCoach(name);
    box.innerHTML = `<div class="lpnl"><div class="lhd"><i class="fas fa-microscope"></i> Análise tática — ${name}</div>
      <div style="padding:8px">
        <div style="font-size:11px;line-height:1.6;color:var(--ac);margin-bottom:8px;border-left:3px solid var(--ac);padding-left:8px">${a.overall_text || ''}</div>
        ${CATS.map(x => `<div style="margin-bottom:6px">
          <div style="font-size:10px;color:var(--ob);font-family:Rajdhani,sans-serif;font-weight:700;margin-bottom:1px"><i class="fas ${x.icon}" style="margin-right:3px"></i>${x.label}</div>
          <div style="font-size:11px;color:var(--tx);line-height:1.5;background:var(--cd2);border-radius:5px;padding:5px 7px">${a[x.k] || '-'}</div>
        </div>`).join('')}
      </div></div>`;
  } catch (e) {
    box.innerHTML = `<div class="lpnl"><div style="color:var(--dn);font-size:11px;padding:8px">Falha na análise: ${e.message}</div></div>`;
  }
}

export function renderCoachPanel(container) {
  container.innerHTML = `
    <div class="pnl" style="padding:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
      <div class="pt" style="border:none;margin:0"><i class="fas fa-chalkboard-teacher"></i> Ranking Detalhado de Técnicos — Brasileirão 2026</div>
      <button id="coachFetch" style="padding:6px 14px;background:rgba(0,230,118,.1);border:1px solid var(--ac);color:var(--ac);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-globe"></i> Buscar Técnicos Online</button>
    </div>
    <div class="pnl" style="padding:8px"><div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Ranking por 3 pilares — <b style="color:var(--ac)">Eficácia Tática</b> (sistema, inovação, técnica), <b style="color:var(--ac2)">Organização em Campo</b> (estrutura, reação) e <b style="color:var(--oo)">Desempenho da Escalação</b> (resultados reais + rotação). Inclui pontos por jogo e últimos 5 resultados.</div><div id="coachTable"></div></div>
    <div id="coachRank"><div style="color:var(--mt);font-size:11px;text-align:center;padding:14px">Clique em "Buscar Técnicos Online" para carregar o ranking detalhado com análise tática e desempenho real de cada treinador (via GE/Globo · ESPN · UOL).</div></div>
    <div id="coachAna" style="margin-top:8px"></div>`;
  container.querySelector('#coachFetch').addEventListener('click', onFetch);
  if (coaches) renderRank(container);
}

async function onFetch() {
  const btn = document.querySelector('#coachFetch');
  const container = document.querySelector('#coachCon');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...'; btn.disabled = true;
  const rank = container.querySelector('#coachRank');
  const tbl = container.querySelector('#coachTable');
  tbl.innerHTML = '';
  rank.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px"><i class="fas fa-spinner fa-spin"></i> Buscando técnicos e analisando táticas, organização e desempenho real online (GE/Globo · ESPN · UOL)...</div>';
  try {
    await fetchCoaches();
    renderRank(container);
  } catch (e) {
    rank.innerHTML = '<div style="color:var(--dn);font-size:11px;padding:8px">Falha: ' + e.message + '</div>';
  } finally {
    btn.innerHTML = orig; btn.disabled = false;
  }
}