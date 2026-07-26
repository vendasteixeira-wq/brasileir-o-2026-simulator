// Busca resultados reais de uma rodada do Brasileirão online (GE/Globo, ESPN, UOL)
// via busca web do LLM, e atribui data/horário às partidas simuladas.
import { base44 } from '@/api/base44Client';

export async function fetchRealRound(roundNum) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um jornalista esportivo. Busque os resultados REAIS da rodada ${roundNum} do Campeonato Brasileiro Série A 2026 (Brasileirão) em sites como GE/Globo Esporte, ESPN Brasil e UOL Esporte. Retorne em JSON a lista de partidas com data, horário, placar e artilheiros (nome do jogador, time e minuto do gol). Se a rodada ainda não foi jogada, retorne status "agendado" com data/horário previstos e scorers vazio. Use os nomes dos times em português (ex: Flamengo, Palmeiras, São Paulo, Atlético-MG, Athletico-PR, Botafogo, Corinthians, Grêmio, Internacional, Cruzeiro, Fluminense, Vasco, Bahia, Fortaleza, Cuiabá, Juventude, Vitória, Criciúma, Santos, Mirassol, Bragantino, Sport, Ceará, Goiás, Chapecoense, Coritiba, Athletico-GO, Remo).`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        round: { type: 'number' },
        source: { type: 'string' },
        matches: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              home: { type: 'string' },
              away: { type: 'string' },
              date: { type: 'string' },
              time: { type: 'string' },
              scoreH: { type: 'number' },
              scoreA: { type: 'number' },
              status: { type: 'string' },
              venue: { type: 'string' },
              scorers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    team: { type: 'string' },
                    minute: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return typeof res === 'string' ? JSON.parse(res) : res;
}

// Atribui data e horário a n partidas a partir de uma data inicial,
// distribuindo ~3 jogos por dia com horários realistas de rodada.
const TIMES = ['21:00', '18:30', '16:00'];
export function assignDates(n, startDateISO) {
  const out = [];
  const base = startDateISO ? new Date(startDateISO + 'T00:00:00') : (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + Math.floor(i / 3));
    out.push({ date: d.toISOString().slice(0, 10), time: TIMES[i % 3] });
  }
  return out;
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const wd = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
  return `${wd} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function renderRealRound(data, box) {
  if (!data || !data.matches || !data.matches.length) {
    box.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px">Nenhuma partida encontrada para esta rodada.</div>';
    return;
  }
  const rows = data.matches.map(m => {
    const isFinal = (m.status || '').toLowerCase() === 'final' || m.scoreH != null;
    const scorersH = (m.scorers || []).filter(s => (s.team || '').toLowerCase() === (m.home || '').toLowerCase());
    const scorersA = (m.scorers || []).filter(s => (s.team || '').toLowerCase() === (m.away || '').toLowerCase());
    const scList = (arr, col) => arr.length
      ? arr.map(s => `<div style="font-size:10px;color:${col}"><i class="fas fa-futbol" style="font-size:8px"></i> <b>${s.name}</b> <span style="color:var(--mt)">${s.minute}'</span></div>`).join('')
      : '';
    const scoreLine = isFinal
      ? `<span style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:18px;color:var(--ac)">${m.scoreH} - ${m.scoreA}</span>`
      : `<span style="color:var(--ac2);font-size:10px;font-family:Rajdhani,sans-serif;font-weight:700">agendado</span>`;
    return `<div class="pp-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="pp-head"><span class="pp-hm">${m.home || '-'}</span><span class="pp-vs">vs</span><span class="pp-aw">${m.away || '-'}</span></div>
        ${scoreLine}
      </div>
      <div style="font-size:10px;color:var(--ob);font-family:Rajdhani,sans-serif;font-weight:700;margin:3px 0"><i class="fas fa-calendar"></i> ${fmtDate(m.date)} ${m.time || ''}${m.venue ? ' · ' + m.venue : ''}</div>
      <div style="display:flex;gap:8px;margin-top:4px"><div style="flex:1">${scList(scorersH, 'var(--hm)')}</div><div style="flex:1">${scList(scorersA, 'var(--aw)')}</div></div>
    </div>`;
  }).join('');
  box.innerHTML = `
    <div class="lpnl"><div class="lhd"><i class="fas fa-globe" style="color:var(--ob)"></i> Rodada ${data.round || ''} — resultados reais online${data.source ? ' · fonte: ' + data.source : ' · GE/ESPN/UOL'}</div>
      <div class="pp-grid">${rows}</div>
      <div style="font-size:9px;color:var(--mt);margin-top:6px;text-align:center"><i class="fas fa-info-circle"></i> Dados obtidos em tempo real via busca web (Globo Esporte / ESPN / UOL). Artilheiros com nome e minuto.</div>
    </div>`;
}