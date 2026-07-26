// Comparativo: previsões da IA (Monte Carlo + Dixon-Coles) vs resultados reais da rodada online.
// Destaca onde a IA mais errou e recomenda ajustes das variáveis de peso do motor.
import { fetchRealRound } from './realRound';
import { predictMatches } from './rodada';
import { B20, gts } from './engine';
import { getCorrections } from './corrections';

const BASELINE = { homeAdv: 0.18, drawBias: 1, goalScale: 1 };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function matchTeam(name) {
  if (!name) return name;
  const n = norm(name);
  let best = B20[0], bs = -1;
  for (const t of B20) {
    const tn = norm(t);
    let sc = 0;
    if (tn === n) sc = 100;
    else if (tn.includes(n) || n.includes(tn)) sc = 80 - Math.abs(tn.length - n.length);
    if (sc > bs) { bs = sc; best = t; }
  }
  return bs >= 40 ? best : name;
}

function buildUI(container) {
  container.innerHTML = `
    <div class="pnl" style="padding:8px;margin-top:6px">
      <div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-balance-scale"></i> Previsões vs Resultado Real da Rodada</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Gera previsões para os confrontos da rodada (Monte Carlo + Dixon-Coles) e compara placar e resultado com o resultado real buscado online (GE/Globo · ESPN · UOL). Destaca os maiores erros e recomenda ajustes de peso do motor (mando de campo, viés de empate, escala de gols).</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
        <label style="font-size:10px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700">Rodada</label>
        <input type="number" id="cmpRodNum" value="${(document.querySelector('#rodNum')||{}).value || 1}" min="1" max="38" class="psr" style="width:60px;padding:5px 8px">
        <button id="cmpRun" style="padding:6px 14px;background:rgba(255,120,40,.1);border:1px solid #ff7820;color:#ff9b4d;border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-balance-scale"></i> Comparar</button>
      </div>
      <div id="cmpOut"></div>
    </div>`;
  container.querySelector('#cmpRun').addEventListener('click', () => run(container));
}

async function run(container) {
  const out = container.querySelector('#cmpOut');
  const btn = container.querySelector('#cmpRun');
  const rn = parseInt(container.querySelector('#cmpRodNum').value) || 1;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Comparando...'; btn.disabled = true;
  out.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:8px"><i class="fas fa-spinner fa-spin"></i> Buscando rodada real online e gerando previsões...</div>';
  try {
    const real = await fetchRealRound(rn);
    const finished = (real.matches || []).filter(m => m.scoreH != null && m.scoreA != null);
    if (!finished.length) {
      out.innerHTML = '<div style="color:var(--ac2);font-size:11px;padding:8px">Rodada ainda sem resultados finalizados (partidas agendadas ou em andamento). Tente outra rodada.</div>';
      return;
    }
    const matchups = finished.map(m => [matchTeam(m.home), matchTeam(m.away)]);
    const preds = predictMatches(matchups, 1500);
    const rows = finished.map((m, i) => {
      const p = preds[i];
      const [ph, pa] = (p.score || '0-0').split('-').map(n => parseInt(n) || 0);
      const rh = m.scoreH, ra = m.scoreA;
      const realOutcome = rh > ra ? 'W' : rh === ra ? 'D' : 'L';
      const favHit = (p.fav === p.h && realOutcome === 'W') || (p.fav === p.a && realOutcome === 'L') || (p.fav === 'Empate' && realOutcome === 'D');
      const scoreErr = Math.abs(ph - rh) + Math.abs(pa - ra);
      return { m, p, ph, pa, rh, ra, realOutcome, favHit, scoreErr };
    });
    render(container, real, rows);
  } catch (e) {
    out.innerHTML = '<div style="color:var(--dn);font-size:11px;padding:8px">Falha: ' + e.message + '</div>';
  } finally {
    btn.innerHTML = orig; btn.disabled = false;
  }
}

function render(container, real, rows) {
  const out = container.querySelector('#cmpOut');
  const n = rows.length;
  let hits = rows.filter(r => r.favHit).length;
  let predHomeRate = +rows.reduce((a, r) => a + r.p.win, 0) / n;
  let predDrawRate = +rows.reduce((a, r) => a + r.p.draw, 0) / n;
  let actHomeRate = rows.filter(r => r.realOutcome === 'W').length / n * 100;
  let actDrawRate = rows.filter(r => r.realOutcome === 'D').length / n * 100;
  let predGoals = +rows.reduce((a, r) => a + r.ph + r.pa, 0) / n;
  let actGoals = +rows.reduce((a, r) => a + r.rh + r.ra, 0) / n;

  // recomendacoes de peso
  const c = getCorrections();
  const recHome = clamp(BASELINE.homeAdv * (actHomeRate / (predHomeRate || 40)), 0.05, 0.45);
  const recDraw = clamp(BASELINE.drawBias * (actDrawRate / (predDrawRate || 25)), 0.7, 1.4);
  const recGoals = clamp(BASELINE.goalScale * (actGoals / (predGoals || 2.4)), 0.7, 1.4);

  // maiores erros
  const worst = [...rows].sort((a, b) => (b.scoreErr + (b.favHit ? 0 : 3)) - (a.scoreErr + (a.favHit ? 0 : 3))).slice(0, 3);
  const worstSet = new Set(worst.map(w => w.p.h + w.p.a));

  const tableRows = rows.map(r => {
    const bad = worstSet.has(r.p.h + r.p.a);
    const errCol = r.favHit ? (r.scoreErr === 0 ? 'var(--ac)' : 'var(--ac2)') : 'var(--dn)';
    const tag = r.favHit ? (r.scoreErr === 0 ? 'PLACAR EXATO' : 'Favorito certo') : 'FAVORITO ERROU';
    return `<tr style="${bad ? 'background:rgba(255,82,82,.08)' : ''}">
      <td style="font-size:10px">${r.m.home} x ${r.m.away}</td>
      <td style="font-family:Rajdhani,sans-serif;font-weight:700;color:var(--oo);text-align:center">${r.p.score}</td>
      <td style="font-size:9px;color:var(--mt);text-align:center">${r.p.win}/${r.p.draw}/${r.p.loss}</td>
      <td style="font-family:Rajdhani,sans-serif;font-weight:700;color:var(--ac);text-align:center">${r.rh}-${r.ra}</td>
      <td style="text-align:center;color:${errCol};font-family:Rajdhani,sans-serif;font-weight:700;font-size:10px">${r.realOutcome === 'W' ? r.m.home : r.realOutcome === 'L' ? r.m.away : 'Empate'}</td>
      <td style="text-align:center;color:${errCol};font-size:9px;font-family:Rajdhani,sans-serif;font-weight:700">${tag}</td>
      <td style="text-align:center;color:${r.scoreErr >= 3 ? 'var(--dn)' : 'var(--mt)'};font-family:Rajdhani,sans-serif;font-weight:700">${r.scoreErr}</td>
    </tr>`;
  }).join('');

  const wRow = (label, cur, rec, hint) => {
    const delta = rec - cur;
    const arr = delta > 0.005 ? '▲' : delta < -0.005 ? '▼' : '·';
    const col = delta > 0.005 ? 'var(--ac)' : delta < -0.005 ? 'var(--dn)' : 'var(--mt)';
    return `<div class="cw-card"><div class="cw-h">${label}</div><div class="cw-val" style="color:${col}">${cur.toFixed(3)} → ${rec.toFixed(3)} <span class="cw-arr">${arr}</span></div><div class="cw-def">${hint}</div></div>`;
  };

  const worstCards = worst.map(w => `<div style="background:rgba(255,82,82,.08);border:1px solid var(--dn);border-radius:6px;padding:6px;margin-bottom:5px">
    <div style="font-size:10px;font-family:Rajdhani,sans-serif;font-weight:700;color:var(--dn)"><i class="fas fa-exclamation-triangle"></i> ${w.m.home} x ${w.m.away}</div>
    <div style="font-size:9px;color:var(--mt)">Previsto <b style="color:var(--oo)">${w.p.score}</b> (fav <b>${w.p.fav}</b>) · Real <b style="color:var(--ac)">${w.rh}-${w.ra}</b> · erro placar ${w.scoreErr}</div>
  </div>`).join('');

  // Agregacao por time: gols previstos vs reais e diferenca percentual
  const teamMap = {};
  rows.forEach(r => {
    if (!teamMap[r.m.home]) teamMap[r.m.home] = { name: r.m.home, pred: 0, real: 0 };
    if (!teamMap[r.m.away]) teamMap[r.m.away] = { name: r.m.away, pred: 0, real: 0 };
    teamMap[r.m.home].pred += r.ph; teamMap[r.m.home].real += r.rh;
    teamMap[r.m.away].pred += r.pa; teamMap[r.m.away].real += r.ra;
  });
  const teams = Object.values(teamMap).map(t => {
    const diffPct = t.real > 0 ? (t.pred - t.real) / t.real * 100 : (t.pred > 0 ? 100 : 0);
    return { ...t, diffPct: +diffPct.toFixed(0), absDiff: Math.abs(diffPct) };
  }).sort((a, b) => b.absDiff - a.absDiff);
  const maxG = Math.max(1, ...teams.map(t => Math.max(t.pred, t.real)));
  const diffCol = d => d.absDiff < 15 ? 'var(--ac)' : d.absDiff < 35 ? 'var(--ac2)' : 'var(--dn)';
  const teamBars = teams.map(t => `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
    <span style="width:84px;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${t.name}">${t.name}</span>
    <div style="flex:1">
      <div style="display:flex;align-items:center;gap:4px"><div style="height:7px;background:var(--oo);border-radius:3px;width:${(t.pred/maxG*100)}%"></div><span style="font-size:8px;color:var(--mt)">${t.pred}</span></div>
      <div style="display:flex;align-items:center;gap:4px;margin-top:1px"><div style="height:7px;background:var(--ac);border-radius:3px;width:${(t.real/maxG*100)}%"></div><span style="font-size:8px;color:var(--mt)">${t.real}</span></div>
    </div>
    <span style="width:54px;font-size:10px;font-family:Rajdhani,sans-serif;font-weight:700;color:${diffCol(t)};text-align:right">${t.diffPct > 0 ? '+' : ''}${t.diffPct}%</span>
  </div>`).join('');

  // Grafico de margem de erro com sinal (previsto - real) por time
  const maxErr = Math.max(1, ...teams.map(t => Math.abs(t.pred - t.real)));
  const errBars = teams.map(t => {
    const err = t.pred - t.real;
    const wPct = Math.abs(err) / maxErr * 50;
    const col = err > 0 ? 'var(--dn)' : err < 0 ? 'var(--ob)' : 'var(--ac)';
    const tag = err > 0 ? 'Super' : err < 0 ? 'Sub' : 'Exato';
    const bar = err > 0
      ? `<div style="position:absolute;left:50%;top:3px;height:9px;width:${wPct}%;background:${col};border-radius:3px"></div>`
      : err < 0
        ? `<div style="position:absolute;right:50%;top:3px;height:9px;width:${wPct}%;background:${col};border-radius:3px"></div>`
        : `<div style="position:absolute;left:50%;top:6px;width:3px;height:3px;background:${col};border-radius:50%"></div>`;
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <span style="width:84px;font-size:9px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${t.name}">${t.name}</span>
      <div style="flex:1;position:relative;height:15px;background:var(--cd2);border-radius:4px">
        <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--mt)"></div>
        ${bar}
      </div>
      <span style="width:66px;font-size:9px;font-family:Rajdhani,sans-serif;font-weight:700;color:${col};text-align:left">${err > 0 ? '+' : ''}${err} · ${tag}</span>
    </div>`;
  }).join('');

  out.innerHTML = `
    <div class="pnl" style="padding:8px;margin-top:6px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-table"></i> Tabela comparativa — Rodada ${real.round || ''} (${n} jogos finalizados)</div>
      <div style="overflow-x:auto"><table class="gt2" style="width:100%"><tr><th style="text-align:left">Partida</th><th>Prev.</th><th>V/E/D %</th><th>Real</th><th>Resultou</th><th>Acerto</th><th>Erro</th></tr>${tableRows}</table></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;flex-wrap:wrap;gap:6px">
        <span style="font-size:11px;color:var(--mt)">Acerto do favorito: <b style="color:${hits/n>0.6?'var(--ac)':'var(--ac2)'}">${hits}/${n}</b> (${(hits/n*100).toFixed(0)}%)</span>
        <span style="font-size:11px;color:var(--mt)">Gols previstos <b style="color:var(--oo)">${predGoals.toFixed(2)}/jogo</b> vs reais <b style="color:var(--ac)">${actGoals.toFixed(2)}/jogo</b></span>
      </div>
    </div>
    <div class="st-grid">
      <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-exclamation-triangle" style="color:var(--dn)"></i> Onde a IA mais errou</div>${worstCards || '<div style="color:var(--mt);font-size:11px">Sem erros relevantes — previsões alinhadas com o real.</div>'}</div>
      <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-sliders-h"></i> Variáveis de peso a ajustar</div>
        <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:5px">Comparação previsto vs real: V casa ${predHomeRate.toFixed(0)}%/${actHomeRate.toFixed(0)}% · Empate ${predDrawRate.toFixed(0)}%/${actDrawRate.toFixed(0)}% · Gols ${predGoals.toFixed(2)}/${actGoals.toFixed(2)}.</div>
        <div class="cw-grid">
          ${wRow('Mando de campo (homeAdv)', c.homeAdv, recHome, 'Multiplica ataque do mandante')}
          ${wRow('Viés de empate (drawBias)', c.drawBias, recDraw, 'Repondera placares iguais')}
          ${wRow('Escala de gols (goalScale)', c.goalScale, recGoals, 'Multiplica lambdaH/lambdaA')}
        </div>
      </div>
    </div>
    <div class="pnl" style="padding:8px;margin-top:6px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-chart-bar"></i> Diferença % Gols Previstos vs Reais por Time</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:8px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> <span style="color:var(--oo)">■</span> gols previstos pela IA · <span style="color:var(--ac)">■</span> gols reais · Diferença % = (previsto − real)/real. Ordenado por maior erro — times no topo têm <b>menor precisão</b>.</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;padding-left:90px"><span style="flex:1;font-size:9px;color:var(--oo);font-family:Rajdhani,sans-serif;font-weight:700">Previsto</span><span style="width:54px"></span></div>
      ${teamBars}
      <div style="font-size:9px;color:var(--mt);margin-top:6px;border-top:1px solid var(--bd);padding-top:5px"><i class="fas fa-info-circle"></i> Verde = |dif| &lt; 15% (preciso) · Amarelo = 15–35% · Vermelho = &gt; 35% (menor precisão).</div>
    </div>
    <div class="pnl" style="padding:8px;margin-top:6px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-exchange-alt"></i> Margem de Erro por Time — Subestimando vs Superestimando</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:8px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Margem = gols previstos − gols reais. Barras à <b style="color:var(--dn)">direita (vermelho)</b> = modelo <b>superestimando</b> o time · barras à <b style="color:var(--ob)">esquerda (azul)</b> = modelo <b>subestimando</b> · linha central = erro zero. Ordenado por maior módulo de erro.</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span style="width:84px"></span><div style="flex:1;display:flex;justify-content:space-between;font-size:8px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700"><span style="color:var(--ob)">← Subestimando</span><span>0</span><span style="color:var(--dn)">Superestimando →</span></div><span style="width:66px"></span></div>
      ${errBars}
      <div style="font-size:9px;color:var(--mt);margin-top:6px;border-top:1px solid var(--bd);padding-top:5px"><i class="fas fa-info-circle"></i> Compare com o gráfico acima: um time com diferença % alta e barra à direita tem ataque superestimado; à esquerda, subestimado — ajuste as variáveis de peso para corrigir o viés.</div>
    </div>`;
}

export function renderRoundCompare(container) {
  if (!container) return;
  buildUI(container);
}