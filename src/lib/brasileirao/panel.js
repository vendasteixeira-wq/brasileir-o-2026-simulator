// Painel de Controle: agrega o historico de simulacoes, exibindo graficos de
// desempenho dos times e a precisao do algoritmo ao longo dos meses.
import { getHistory, getMetrics } from './learning';

function monthKey(ts) {
  if (!ts) return 'Anterior';
  const d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function agg(hist) {
  const byMonth = {};
  const teams = {};
  hist.forEach(r => {
    const k = monthKey(r.ts);
    if (!byMonth[k]) byMonth[k] = { n: 0, correct: 0, brier: 0, goals: 0 };
    const bm = byMonth[k];
    bm.n++;
    const fav = r.pred.win >= r.pred.draw && r.pred.win >= r.pred.loss ? 'W'
      : r.pred.draw >= r.pred.loss ? 'D' : 'L';
    if (fav === r.act.outcome) bm.correct++;
    const pW = r.pred.win / 100, pD = r.pred.draw / 100, pL = r.pred.loss / 100;
    bm.brier += (pW - (r.act.outcome === 'W' ? 1 : 0)) ** 2
      + (pD - (r.act.outcome === 'D' ? 1 : 0)) ** 2
      + (pL - (r.act.outcome === 'L' ? 1 : 0)) ** 2;
    bm.goals += r.act.h + r.act.a;

    [r.h, r.a].forEach(t => { if (!teams[t]) teams[t] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 }; });
    teams[r.h].p++; teams[r.a].p++;
    teams[r.h].gf += r.act.h; teams[r.h].ga += r.act.a;
    teams[r.a].gf += r.act.a; teams[r.a].ga += r.act.h;
    if (r.act.h > r.act.a) { teams[r.h].w++; teams[r.a].l++; }
    else if (r.act.h === r.act.a) { teams[r.h].d++; teams[r.a].d++; }
    else { teams[r.a].w++; teams[r.h].l++; }
  });
  const months = Object.keys(byMonth).sort();
  const teamArr = Object.entries(teams).map(([t, s]) => ({ t, ...s, pts: s.w * 3 + s.d })).sort((a, b) => b.pts - a.pts);
  return { byMonth, months, teamArr };
}

function card(label, val, sub, color) {
  return `<div style="background:var(--cd2);border:1px solid var(--bd);border-radius:8px;padding:10px;flex:1;min-width:140px">
    <div style="font-size:9px;color:var(--mt);text-transform:uppercase;letter-spacing:.5px">${label}</div>
    <div style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:22px;color:${color || 'var(--tx)'};margin:2px 0">${val}</div>
    <div style="font-size:9px;color:var(--mt)">${sub || ''}</div>
  </div>`;
}

function drawLine(cv, labels, accData, briData) {
  const host = cv.parentElement;
  const cssW = host.clientWidth || 600, cssH = 200;
  const dpr = window.devicePixelRatio || 1;
  cv.width = cssW * dpr; cv.height = cssH * dpr; cv.style.height = cssH + 'px';
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  const padL = 34, padB = 22, padT = 10, padR = 34;
  const cw = cssW - padL - padR, ch = cssH - padB - padT;
  ctx.strokeStyle = '#2a3140'; ctx.fillStyle = '#6b7682'; ctx.font = '9px Rajdhani, sans-serif'; ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const y = padT + ch * g / 4; ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(cssW - padR, y); ctx.stroke();
    ctx.fillText(String(100 - g * 25), padL - 3, y + 3);
  }
  const n = labels.length;
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.ceil(n / 12));
  labels.forEach((l, i) => { if (i % step === 0 || i === n - 1) { const x = n <= 1 ? padL + cw / 2 : padL + cw * i / (n - 1); ctx.fillText(l, x, cssH - 6); } });
  const px = i => n <= 1 ? padL + cw / 2 : padL + cw * i / (n - 1);
  // Brier (0..2 -> 0..100, invertido: menor=better, plota como 100 - brier/2*100)
  if (briData.length) {
    ctx.strokeStyle = '#ff9b4d'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath();
    briData.forEach((v, i) => { const x = px(i); const y = padT + ch * (1 - (100 - v / 2 * 100) / 100); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke(); ctx.setLineDash([]);
  }
  // Accuracy
  if (accData.length) {
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.beginPath();
    accData.forEach((v, i) => { const x = px(i); const y = padT + ch * (1 - v / 100); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
    accData.forEach((v, i) => { const x = px(i); const y = padT + ch * (1 - v / 100); ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); });
  }
}

function drawBars(cv, items) {
  const host = cv.parentElement;
  const cssW = host.clientWidth || 600, cssH = Math.max(180, items.length * 22 + 10);
  const dpr = window.devicePixelRatio || 1;
  cv.width = cssW * dpr; cv.height = cssH * dpr; cv.style.height = cssH + 'px';
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  const padL = 92, padR = 30, rowH = 22, barH = 14;
  const max = Math.max(...items.map(i => i.value), 1);
  items.forEach((it, i) => {
    const y = i * rowH + 4;
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Rajdhani, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(it.label.slice(0, 14), padL - 6, y + barH / 2 + 3);
    ctx.fillStyle = '#1b2330'; ctx.fillRect(padL, y, cssW - padL - padR, barH);
    const w = (cssW - padL - padR) * (it.value / max);
    const g = ctx.createLinearGradient(padL, 0, padL + w, 0);
    g.addColorStop(0, it.color); g.addColorStop(1, it.color2 || it.color);
    ctx.fillStyle = g; ctx.fillRect(padL, y, w, barH);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = 'bold 10px Rajdhani, sans-serif';
    ctx.fillText(String(it.value), padL + w + 4, y + barH / 2 + 3);
  });
}

export function renderPanel(host) {
  const hist = getHistory();
  const m = getMetrics();
  if (!hist.length) {
    host.innerHTML = `<div class="pnl" style="padding:14px;text-align:center;color:var(--mt);font-size:12px">
      <i class="fas fa-chart-line" style="font-size:28px;color:var(--ob);display:block;margin-bottom:8px"></i>
      Sem histórico de simulações ainda. Vá em <b>Intuição → Calibrar</b> para gerar partidas e alimentar este painel.</div>`;
    return;
  }
  const { byMonth, months, teamArr } = agg(hist);
  const accData = months.map(k => byMonth[k].n ? +(byMonth[k].correct / byMonth[k].n * 100).toFixed(1) : 0);
  const briData = months.map(k => byMonth[k].n ? +(byMonth[k].brier / byMonth[k].n).toFixed(3) : 0);
  const topTeams = teamArr.slice(0, 12);
  const maxMonth = months.reduce((a, k) => byMonth[k].n > (byMonth[a] ? byMonth[a].n : 0) ? k : a, months[0]);
  const mostSim = teamArr[0];

  const monthRows = months.slice().reverse().map(k => {
    const bm = byMonth[k];
    const acc = bm.n ? (bm.correct / bm.n * 100).toFixed(1) : '0';
    const bri = bm.n ? (bm.brier / bm.n).toFixed(3) : '0';
    return `<tr><td>${k}</td><td>${bm.n}</td><td style="color:var(--ac)">${acc}%</td><td style="color:var(--ac2)">${bri}</td><td>${(bm.goals / bm.n).toFixed(2)}</td></tr>`;
  }).join('');

  host.innerHTML = `
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
      ${card('Simulações', hist.length, 'partidas avaliadas', 'var(--ob)')}
      ${card('Precisão global', m ? m.accuracy + '%' : '-', 'acerto do favorito', 'var(--ac)')}
      ${card('Brier', m ? m.brier : '-', 'menor = melhor', 'var(--ac2)')}
      ${card('Gols/jogo', m ? m.actGoals : '-', 'previsto ' + (m ? m.predGoals : '-'), 'var(--dn)')}
      ${card('Mês ativo', maxMonth, byMonth[maxMonth] ? byMonth[maxMonth].n + ' partidas' : '', 'var(--hm)')}
      ${card('Time líder', mostSim ? mostSim.t : '-', mostSim ? mostSim.pts + ' pts · ' + mostSim.w + 'V' : '', 'var(--aw)')}
    </div>
    <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-chart-line"></i> Precisão do algoritmo por mês</div>
      <div style="font-size:9px;color:var(--mt);margin-bottom:4px"><span style="color:var(--ac)">■ Precisão (%)</span> · <span style="color:#ff9b4d">┄ Brier (invertido, 0..2)</span></div>
      <div style="width:100%;overflow-x:auto"><canvas id="ctrlLine" style="display:block;width:100%;height:200px;background:var(--cd2);border:1px solid var(--bd);border-radius:6px"></canvas></div></div>
    <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-trophy"></i> Desempenho dos times (top 12 por pontos)</div>
      <div style="width:100%;overflow-x:auto"><canvas id="ctrlBars" style="display:block;width:100%;background:var(--cd2);border:1px solid var(--bd);border-radius:6px"></canvas></div></div>
    <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-table"></i> Detalhamento mensal</div>
      <div style="overflow-x:auto"><table class="st-tbl"><tr><th>Mês</th><th>Partidas</th><th>Precisão</th><th>Brier</th><th>Gols/jogo</th></tr>${monthRows}</table></div></div>
    <div class="pnl" style="padding:8px"><div style="font-size:10px;color:var(--mt);line-height:1.5"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Dados agregados do histórico local de calibração (Intuição → Calibrar). Cada partida gera uma previsão (Monte Carlo + Elo + Dixon-Coles) comparada ao resultado simulado. Precisão = acerto do favorito; Brier mede a calibração das probabilidades (0=perfeito, 2=pior). Padrões mensais indicam tendências de viés do motor.</div></div>`;

  drawLine(host.querySelector('#ctrlLine'), months, accData, briData);
  const palette = [['#22c55e', '#16a34a'], ['#3b82f6', '#2563eb'], ['#f97316', '#ea580c'], ['#eab308', '#ca8a04'], ['#a855f7', '#9333ea'], ['#ec4899', '#db2777']];
  drawBars(host.querySelector('#ctrlBars'), topTeams.map((t, i) => ({
    label: t.t, value: t.pts, color: palette[i % palette.length][0], color2: palette[i % palette.length][1]
  })));
}

export function redrawPanel(host) {
  if (host && host.querySelector('#ctrlLine')) renderPanel(host);
}