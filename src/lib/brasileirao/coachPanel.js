// Ranking de técnicos do Brasileirão 2026 + análise tática online (via busca web LLM).
import { base44 } from '@/api/base44Client';
import { B20 } from './engine';

export const CATS = [
  { k: 'tactica', label: 'Tática', icon: 'fa-chess' },
  { k: 'inovacao', label: 'Inovação', icon: 'fa-lightbulb' },
  { k: 'tecnica', label: 'Técnica', icon: 'fa-wrench' },
  { k: 'organizacao', label: 'Organização', icon: 'fa-sitemap' },
  { k: 'selecao', label: 'Seleção', icon: 'fa-list-ol' },
  { k: 'escalacao', label: 'Desempenho Escalação', icon: 'fa-clipboard-check' },
  { k: 'reorganizacao', label: 'Reorganização', icon: 'fa-sync-alt' }
];

let coaches = null;
let lastFetched = null;

export function getCoaches() { return coaches; }

export function scoreCoach(c) {
  const s = CATS.reduce((a, x) => a + (c[x.k] || 0), 0);
  return +(s / CATS.length).toFixed(1);
}

function rcBar(v) {
  const col = v >= 80 ? 'var(--ac)' : v >= 65 ? 'var(--ac2)' : v >= 50 ? 'var(--oo)' : 'var(--dn)';
  return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px"><span style="width:78px;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif">${CATS.find(x=>true).label.replace(CATS[0].label,'')}</span></div>`;
}

export async function fetchCoaches() {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um analista de futebol especializado em treinadores. Liste os 20 técnicos (head coaches) atuais do Campeonato Brasileiro Série A 2026 (times: ${B20.join(', ')}). Para cada técnico, atribua notas de 0 a 100 em 7 categorias: tactica (sistema tático e estilo de jogo), inovacao (inovações e ideias modernas), tecnica (treino técnico e jogadas ensaiadas), organizacao (organização defensiva e estrutura), selecao (escolha de titulares e rotação de elenco), escalacao (desempenho da escalação e resultados em campo), reorganizacao (capacidade de reorganizar o time e reagir durante jogos). Informe o clube, a formação base (ex: 4-3-3) e um resumo tático curto (até 120 caracteres). Use dados reais e atuais de GE/Globo Esporte, ESPN, UOL.`,
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
              summary: { type: 'string' }
            }
          }
        }
      }
    }
  });
  const data = typeof res === 'string' ? JSON.parse(res) : res;
  coaches = (data.coaches || []).map(c => ({ ...c, overall: scoreCoach(c) })).sort((a, b) => b.overall - a.overall);
  lastFetched = new Date();
  return coaches;
}

export async function analyzeCoach(name) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um analista tático de futebol. Faça uma análise detalhada do treinador ${name} (Brasileirão 2026) cobrindo: (1) tática e estilo de jogo (sistema, posse, transições); (2) inovações e ideias modernas; (3) técnicas de treino e jogadas ensaiadas; (4) organização defensiva e estrutura; (5) seleção de titulares e rotação; (6) desempenho da escalação e resultados recentes; (7) reorganização do time durante jogos e reações. Use dados reais e atuais de GE/Globo, ESPN, UOL. Retorne JSON com cada dimensão como texto descritivo (até 220 caracteres) e uma síntese geral (overall_text até 320 caracteres).`,
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

function renderRank(container) {
  const rank = container.querySelector('#coachRank');
  if (!coaches || !coaches.length) {
    rank.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px">Nenhum técnico carregado.</div>';
    return;
  }
  rank.innerHTML = coaches.map((c, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    const oCol = rankColor(c.overall);
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
      ${CATS.map(x => catBar(x.label, c[x.k] || 0, x.icon)).join('')}
      <div style="font-size:10px;color:var(--mt);line-height:1.4;margin-top:4px;border-top:1px solid var(--bd);padding-top:4px">${c.summary || ''}</div>
      <button data-coach="${c.name}" style="margin-top:6px;width:100%;padding:5px;background:rgba(99,102,241,.12);border:1px solid #6366f1;color:#818cf8;border-radius:5px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px"><i class="fas fa-microscope"></i> Analisar Tática</button>
    </div>`;
  }).join('');
  rank.querySelectorAll('[data-coach]').forEach(b => b.addEventListener('click', () => onAnalyze(b.dataset.coach)));
}

async function onAnalyze(name) {
  const box = document.querySelector('#coachAna');
  box.innerHTML = `<div class="lpnl"><div class="lhd"><i class="fas fa-microscope"></i> Análise tática — ${name}</div><div style="color:var(--mt);font-size:11px;padding:8px"><i class="fas fa-spinner fa-spin"></i> Analisando tática, inovações e organização online...</div></div>`;
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
      <div class="pt" style="border:none;margin:0"><i class="fas fa-chalkboard-teacher"></i> Ranking de Técnicos — análise tática (Brasileirão 2026)</div>
      <button id="coachFetch" style="padding:6px 14px;background:rgba(0,230,118,.1);border:1px solid var(--ac);color:var(--ac);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-globe"></i> Buscar Técnicos Online</button>
    </div>
    <div id="coachRank"><div style="color:var(--mt);font-size:11px;text-align:center;padding:14px">Clique em "Buscar Técnicos Online" para carregar o ranking com análise tática de cada treinador (via GE/Globo · ESPN · UOL).<br><br>Categorias avaliadas: <b>tática, inovação, técnica, organização, seleção, desempenho da escalação e reorganização do time</b>.</div></div>
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
  rank.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px"><i class="fas fa-spinner fa-spin"></i> Buscando técnicos e analisando táticas online (GE/Globo · ESPN · UOL)...</div>';
  try {
    await fetchCoaches();
    renderRank(container);
  } catch (e) {
    rank.innerHTML = '<div style="color:var(--dn);font-size:11px;padding:8px">Falha: ' + e.message + '</div>';
  } finally {
    btn.innerHTML = orig; btn.disabled = false;
  }
}