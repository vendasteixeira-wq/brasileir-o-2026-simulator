import { PL, LG, COMP, FMS, B20, pc, pco, rc, gto, gppda, gts, getStatsOverride, Sim, CH, TPred } from './engine';
import { monteCarlo } from './predict';
import { gerarSugestoes } from './loteria';
import { roundRobin, predictMatches } from './rodada';
import { parseCSV, applyImport, clearImport } from './statsImport';
import { base44 } from '@/api/base44Client';

export function initBrasileirao(root) {
  document.body.classList.add('br-page');

  let SIM = null;
  let USQ = new Array(11).fill(null);
  let CF = '4-3-3';
  let SS = -1;
  let lt = 0;
  const speeds = [1, 2, 4, 8, 16];
  let si = 0;
  let rafId = 0;

  const $ = id => root.querySelector('#' + id);

  const hh = $('hh'), ha = $('ha'), hsc = $('hsc'), htm = $('htm'),
        hxg = $('hxg'), mst = $('mst'), elog = $('elog'), ppnl = $('ppnl');

  // --- Populate selects ---
  function popTS() {
    const all = [...new Set(PL.map(p => p.club))].sort((a, b) => gto(b) - gto(a));
    ['ht', 'at'].forEach(id => {
      const s = $(id);
      s.innerHTML = all.map(t => `<option value="${t}">${t} (${gto(t)})</option>`).join('');
    });
    const bi = all.indexOf('Flamengo');
    if (bi >= 0) $('ht').selectedIndex = bi;
    const pi = all.indexOf('Palmeiras');
    if (pi >= 0) $('at').selectedIndex = pi;
  }
  function popCS() { $('csel').innerHTML = COMP.map(c => `<option value="${c.id}">${c.name}</option>`).join(''); }
  function popLF() {
    $('dbl').innerHTML = '<option value="">Todas Ligas</option>' +
      Object.entries(LG).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}</option>`).join('');
  }

  // --- Nav ---
  const navBtns = root.querySelectorAll('#nav button');
  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    root.querySelectorAll('.tc').forEach(t => t.classList.remove('on'));
    $('t-' + b.dataset.t).classList.add('on');
    if (b.dataset.t === 'squad') rSq();
    if (b.dataset.t === 'db') rDB();
    if (b.dataset.t === 'lot') rLot();
    if (b.dataset.t === 'imp') rImp();
    if (b.dataset.t === 'rod') rRod();
  }));

  // --- Canvas ---
  const cv = $('cv');
  function rsCV() {
    const w = cv.parentElement;
    cv.width = w.clientWidth * (window.devicePixelRatio || 1);
    cv.height = w.clientHeight * (window.devicePixelRatio || 1);
  }
  rsCV();
  window.addEventListener('resize', rsCV);

  // --- Toast ---
  function toast(msg, type) {
    const t = document.createElement('div');
    t.className = 'to ' + (type || 'ok');
    t.textContent = msg;
    $('tsts').appendChild(t);
    setTimeout(() => { t.remove(); }, 3000);
  }

  // --- Monte Carlo probability panel ---
  function rMC() {
    const h = $('ht').value, a = $('at').value;
    if (h === a) { ppnl.innerHTML = '<div style="color:var(--mt);text-align:center;font-size:10px;padding:8px">Selecione times diferentes</div>'; return; }
    const mc = monteCarlo(h, a, 3000);
    const bar = (pct, col) => `<div class="mcb"><div class="mcf" style="width:${pct}%;background:${col}"></div></div>`;
    const wColor = mc.win > 50 ? 'var(--ac)' : 'var(--mt)';
    const lColor = mc.loss > 50 ? 'var(--dn)' : 'var(--mt)';
    ppnl.innerHTML = `
      <div class="mce">
        <div class="mcr"><span class="mcl">VIT ${h}</span><span class="mcv" style="color:${wColor}">${mc.win}%</span></div>
        ${bar(mc.win, 'var(--ac)')}
        <div class="mcr"><span class="mcl">EMPATE</span><span class="mcv" style="color:var(--ac2)">${mc.draw}%</span></div>
        ${bar(mc.draw, 'var(--ac2)')}
        <div class="mcr"><span class="mcl">VIT ${a}</span><span class="mcv" style="color:${lColor}">${mc.loss}%</span></div>
        ${bar(mc.loss, 'var(--dn)')}
      </div>
      <div class="mcx"><span>xG ${mc.xgH}</span><span>Elo ${mc.eloH}</span><span>${mc.eloA} Elo</span><span>${mc.xgA} xG</span></div>
      <div class="mct">${mc.top.map(s => `<div class="mcs"><span class="mcsn">${s.score}</span><span class="mcsp">${s.pct.toFixed(1)}%</span></div>`).join('')}</div>
      <div style="color:var(--mt);font-size:8px;text-align:center;margin-top:4px">Monte Carlo · Dixon-Coles · 3000x</div>`;
  }

  // --- Intel pre-jogo via Gemini (web search) ---
  async function rIntel() {
    const h = $('ht').value, a = $('at').value;
    if (h === a) { toast('Selecione times diferentes!', 'wr'); return; }
    const ipnl = $('ipnl');
    ipnl.innerHTML = '<div class="ild">Buscando escalações, lesões e forma recente...</div>';
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um analista de futebol. Para a partida ${h} (mandante) vs ${a} (visitante) no Brasileirão 2026, faça uma análise pré-jogo BREVE baseada em dados reais e atuais. Retorne em JSON: { "esc_h": "escalação provável do ${h} (titulares)", "esc_a": "escalação provável do ${a}", "desfalques_h": "lesões/suspensões do ${h}", "desfalques_a": "lesões/suspensões do ${a}", "forma_h": "últimos 5 jogos do ${h}", "forma_a": "últimos 5 jogos do ${a}", "palpite": "palpite de placar e justificativa curta" }. Seja conciso.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            esc_h: { type: 'string' }, esc_a: { type: 'string' },
            desfalques_h: { type: 'string' }, desfalques_a: { type: 'string' },
            forma_h: { type: 'string' }, forma_a: { type: 'string' },
            palpite: { type: 'string' }
          }
        }
      });
      const d = typeof res === 'string' ? JSON.parse(res) : res;
      ipnl.innerHTML = `
        <div class="ilr"><div class="ilh">${h}</div><div class="ilb"><b>Escal:</b> ${d.esc_h || '-'}</div><div class="ilb"><b>Desfalques:</b> ${d.desfalques_h || '-'}</div><div class="ilb"><b>Forma:</b> ${d.forma_h || '-'}</div></div>
        <div class="ilr"><div class="ilh">${a}</div><div class="ilb"><b>Escal:</b> ${d.esc_a || '-'}</div><div class="ilb"><b>Desfalques:</b> ${d.desfalques_a || '-'}</div><div class="ilb"><b>Forma:</b> ${d.forma_a || '-'}</div></div>
        <div class="ilp">${d.palpite || '-'}</div>`;
    } catch (e) {
      ipnl.innerHTML = '<div class="ild" style="color:var(--dn)">Falha ao buscar intel. Tente novamente.</div>';
    }
  }

  // --- Team indicators ---
  const tind = $('tind');
  function rTInd() {
    const h = $('ht').value, a = $('at').value;
    if (h === a) { tind.innerHTML = '<div style="color:var(--mt);text-align:center;font-size:11px;padding:4px">Selecione times diferentes</div>'; return; }
    const hs = gts(h), as = gts(a);
    const rows = [
      ['OVR Geral', hs.ovr, as.ovr],
      ['Ataque (ATK)', hs.atk, as.atk],
      ['Meio (MID)', hs.mid, as.mid],
      ['Defesa (DEF)', hs.def, as.def],
      ['Goleiro', hs.gk, as.gk],
      ['xG Total', hs.xG, as.xG],
      ['xA Total', hs.xA, as.xA],
      ['Conversão', hs.conv, as.conv],
      ['Passe %', hs.pas, as.pas],
      ['PPDA', hs.ppda, as.ppda]
    ];
    tind.innerHTML = '<div class="iti">' + rows.map(([l, hv, av]) => {
      const hBetter = hv > av, aBetter = av > hv;
      const fmt = v => typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v;
      return `<div class="ir">
        <span class="iv ${hBetter ? 'bt' : ''}">${fmt(hv)}</span>
        <span class="il">${l}</span>
        <span class="iv ${aBetter ? 'bt' : ''}">${fmt(av)}</span>
      </div>`;
    }).join('') + '</div>';
  }

  // --- Match controls ---
  $('ht').addEventListener('change', () => { rTInd(); rMC(); });
  $('at').addEventListener('change', () => { rTInd(); rMC(); });

  $('bI').addEventListener('click', rIntel);
  $('bInt').addEventListener('click', rIntel);

  $('bS').addEventListener('click', () => {
    if (SIM && SIM.run) return;
    const h = $('ht').value, a = $('at').value;
    if (h === a) { toast('Selecione times diferentes!', 'wr'); return; }
    rsCV();
    SIM = new Sim(cv, h, a);
    SIM.start();
    toast('Partida: ' + h + ' vs ' + a, 'ok');
  });
  $('bP').addEventListener('click', () => { if (SIM) SIM.pause(); });
  $('bQ').addEventListener('click', () => {
    const h = $('ht').value, a = $('at').value;
    if (h === a) { toast('Selecione times diferentes!', 'wr'); return; }
    rsCV();
    SIM = new Sim(cv, h, a);
    SIM.quickSim();
    SIM.render();
    hh.textContent = SIM.hc;
    ha.textContent = SIM.ac;
    hsc.textContent = SIM.sc2.h + ' - ' + SIM.sc2.a;
    htm.textContent = "90'";
    hxg.textContent = 'xG ' + SIM.xg.h.toFixed(2) + ' - ' + SIM.xg.a.toFixed(2);
    mst.innerHTML = SIM.gSH();
    elog.innerHTML = SIM.gEH();
    ppnl.innerHTML = '';
    rMC();
    const w = SIM.sc2.h > SIM.sc2.a ? h : SIM.sc2.a > SIM.sc2.h ? a : 'Empate';
    toast(w === 'Empate' ? 'Empate: ' + SIM.sc2.h + 'x' + SIM.sc2.a : w + ' venceu ' + SIM.sc2.h + 'x' + SIM.sc2.a, 'ok');
  });
  $('bR').addEventListener('click', () => {
    if (SIM) SIM.reset();
    hsc.textContent = '0 - 0';
    htm.textContent = "00'";
    hxg.textContent = 'xG 0.00 - 0.00';
    mst.innerHTML = '';
    elog.innerHTML = '';
    ppnl.innerHTML = '';
  });
  $('bSp').addEventListener('click', () => {
    si = (si + 1) % speeds.length;
    if (SIM) SIM.setSpd(speeds[si]);
    $('bSp').innerHTML = '<i class="fas fa-forward"></i> ' + speeds[si] + 'x';
  });

  // --- Game loop ---
  function loop(t) {
    if (SIM && SIM.run) {
      if (!lt) lt = t;
      const dt = Math.min((t - lt) / 1000, 0.05);
      lt = t;
      SIM.tick(dt);
      SIM.render();
      hh.textContent = SIM.hc;
      ha.textContent = SIM.ac;
      hsc.textContent = SIM.sc2.h + ' - ' + SIM.sc2.a;
      htm.textContent = String(SIM.gm()).padStart(2, '0') + "'";
      hxg.textContent = 'xG ' + SIM.xg.h.toFixed(2) + ' - ' + SIM.xg.a.toFixed(2);
      mst.innerHTML = SIM.gSH();
      elog.innerHTML = SIM.gEH();
      ppnl.innerHTML = SIM.gPH();
    } else {
      lt = 0;
      if (SIM) SIM.render();
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  // --- Squad builder ---
  function rSq() {
    const fsel = $('fsel');
    fsel.innerHTML = Object.keys(FMS).map(f =>
      `<button class="${f === CF ? 'on' : ''}" data-f="${f}">${f}</button>`
    ).join('');
    fsel.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      CF = b.dataset.f;
      rSq();
    }));
    $('bA').onclick = () => {
      const fm = FMS[CF];
      USQ = new Array(11).fill(null);
      const used = new Set();
      fm.ps.forEach((pos, i) => {
        let best = null, bs = -1;
        PL.forEach((p, idx) => {
          if (used.has(idx)) return;
          const c = pco(pos, p);
          const sc = c * 100 + p.ovr;
          if (c > 0 && sc > bs) { bs = sc; best = idx; }
        });
        if (best !== null) { used.add(best); USQ[i] = PL[best]; }
      });
      rPit(); rChem();
      toast('Elenco preenchido!', 'ok');
    };
    rPit();
    rChem();
    rPList();
  }

  function rPit() {
    const fm = FMS[CF];
    const pitch = $('spit');
    pitch.innerHTML = fm.sl.map((s, i) => {
      const p = USQ[i];
      if (p) {
        return `<div class="ss hp" style="left:${s[0]}%;top:${s[1]}%" data-i="${i}">
          <div class="cd">
            <div class="ov">${p.ovr}</div>
            <div class="ps">${fm.ps[i]}</div>
            <div class="cl">${p.nation}</div>
            <div class="pn">${p.name}</div>
          </div>
        </div>`;
      }
      return `<div class="ss emp" style="left:${s[0]}%;top:${s[1]}%" data-i="${i}"><div class="cd"></div></div>`;
    }).join('');
    pitch.querySelectorAll('.ss').forEach(el => el.addEventListener('click', () => {
      SS = +el.dataset.i;
      openModal(fm.ps[SS]);
    }));
  }

  function rChem() {
    const c = CH.calc(USQ, CF);
    const ovr = CH.ovr(USQ, c);
    const ccir = $('ccir');
    ccir.textContent = c;
    ccir.style.borderColor = rc(c);
    ccir.style.color = rc(c);
    $('cval').textContent = c + '/100';
    $('sovr').textContent = 'OVR: ' + ovr;
  }

  function rPList() {
    const q = ($('psrch').value || '').toLowerCase();
    const filtered = PL.filter(p => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => b.ovr - a.ovr).slice(0, 150);
    const list = $('plist');
    list.innerHTML = filtered.map(p =>
      `<div class="pit" data-name="${p.name}">
        <span class="po" style="color:${rc(p.ovr)}">${p.ovr}</span>
        <span class="pp">${p.pos}</span>
        <span class="pnm">${p.name}</span>
        <span class="pcl">${p.club}</span>
      </div>`
    ).join('');
    list.querySelectorAll('.pit').forEach(e => e.addEventListener('click', () => {
      const p = PL.find(x => x.name === e.dataset.name);
      if (SS >= 0) {
        USQ[SS] = p; SS = -1;
        closeModal(); rPit(); rChem();
      } else {
        const i = USQ.findIndex(x => !x);
        if (i >= 0) { USQ[i] = p; rPit(); rChem(); }
        else toast('Elenco cheio! Clique em um slot.', 'wr');
      }
    }));
  }

  // --- Modal ---
  function openModal(pos) {
    $('mttl').textContent = 'Selecionar ' + pos;
    $('msrc').value = '';
    filterModal('');
    $('slmod').classList.add('sh');
  }
  function filterModal(q) {
    const filtered = PL.filter(p => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => b.ovr - a.ovr).slice(0, 200);
    const mpl = $('mpl');
    mpl.innerHTML = filtered.map(p =>
      `<div class="pit" data-name="${p.name}">
        <span class="po" style="color:${rc(p.ovr)}">${p.ovr}</span>
        <span class="pp">${p.pos}</span>
        <span class="pnm">${p.name}</span>
        <span class="pcl">${p.club}</span>
      </div>`
    ).join('');
    mpl.querySelectorAll('.pit').forEach(e => e.addEventListener('click', () => {
      const p = PL.find(x => x.name === e.dataset.name);
      if (SS >= 0) {
        USQ[SS] = p; SS = -1;
        closeModal(); rPit(); rChem();
      }
    }));
  }
  function closeModal() { $('slmod').classList.remove('sh'); }
  $('mcls').addEventListener('click', closeModal);
  $('msrc').addEventListener('input', () => filterModal($('msrc').value.toLowerCase()));
  $('slmod').addEventListener('click', e => { if (e.target === $('slmod')) closeModal(); });
  $('psrch').addEventListener('input', rPList);

  // --- Tournament ---
  $('bST').addEventListener('click', () => {
    const id = $('csel').value;
    const pred = new TPred(id);
    pred.sim();
    $('tcon').innerHTML = pred.render();
    toast(pred.win ? pred.win.name + ' campeão!' : 'Simulação concluída', 'ok');
  });

  // --- Database ---
  function rDB() {
    const q = ($('dbs').value || '').toLowerCase();
    const lg = $('dbl').value;
    const pos = $('dbp').value;
    const sort = $('dbs2').value;
    let filtered = PL.filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (lg && p.league !== lg) return false;
      if (pos && pc(p.pos) !== pos) return false;
      return true;
    });
    filtered.sort((a, b) => b[sort] - a[sort]);
    $('dgr').innerHTML = filtered.slice(0, 60).map(p => {
      const stats = [['PAC', p.pac], ['SHO', p.sho], ['PAS', p.pas], ['DRI', p.dri], ['DEF', p.def], ['PHY', p.phy]];
      return `<div class="dc">
        <div class="do">${p.ovr}</div>
        <div class="dp">${p.pos} · ${p.nation}</div>
        <div class="dn">${p.name}</div>
        <div class="dk">${p.club} · ${(LG[p.league] || {}).name || p.league}</div>
        <div class="da">${stats.map(([l, v]) =>
          `<div class="dr"><span class="dl">${l}</span><span class="dv" style="color:${rc(v)}">${v}</span></div>`
        ).join('')}</div>
        <div class="ob"><span class="ol">xG</span><div class="obb"><div class="of" style="background:var(--oo);width:${Math.min(100, p.xG90 * 100)}%"></div></div><span class="ov2">${p.xG90}</span></div>
        <div class="ob"><span class="ol">xA</span><div class="obb"><div class="of" style="background:var(--ob);width:${Math.min(100, p.xA90 * 100)}%"></div></div><span class="ov2">${p.xA90}</span></div>
      </div>`;
    }).join('');
  }
  $('dbs').addEventListener('input', rDB);
  $('dbl').addEventListener('change', rDB);
  $('dbp').addEventListener('change', rDB);
  $('dbs2').addEventListener('change', rDB);

  // --- Loteria (Mega Sena & Quina) ---
  function rLot() {
    const res = gerarSugestoes();
    const ball = (n, big) => `<span class="lb${big ? ' bg' : ''}">${n}</span>`;
    const setHTML = (g, big) => g.nums.map(n => ball(n, big)).join('') + `<span class="lq" style="color:${rc(g.q)}">${g.q}%</span>`;
    const labels = ['Jogo 1 (melhor chance)', 'Jogo 2', 'Jogo 3', 'Jogo Bonus'];
    const mp = res.prob.mega, qp = res.prob.quina;
    const fmtP = p => p < 1e-4 ? (p * 1e6).toFixed(2) + ' ppm' : (p * 100).toFixed(4) + '%';
    const megaRows = res.mega.games.map((g, i) => `<div class="lrow"><span class="lrt">${labels[i]}</span><div class="lballs">${setHTML(g, i === 0)}</div><span class="lpr">chance ${g.q}%</span></div>`).join('');
    const quinaRows = res.quina.games.map((g, i) => `<div class="lrow"><span class="lrt">${labels[i]}</span><div class="lballs">${setHTML(g, i === 0)}</div><span class="lpr">chance ${g.q}%</span></div>`).join('');
    $('lcon').innerHTML = `
      <div class="lpnl"><div class="lhd"><i class="fas fa-calendar-day"></i> Sugestoes para ${res.date}</div>
      <div class="ldisc"><i class="fas fa-info-circle"></i> Seed diaria + combinatoria exata + balanceamento (soma, par/impar, decadas). 3 jogos + 1 bonus, ordenados por maior chance de acerto. Loteria e aleatoria — nao garante premio.</div></div>
      <div class="lpnl"><div class="lh2"><i class="fas fa-trophy" style="color:var(--ac2)"></i> Mega Sena (6 de 60) — 4 jogos</div>
      ${megaRows}
      <div class="lrow" style="border:none;color:var(--ob);font-size:9px"><i class="fas fa-link"></i> Covariancia media entre os 4 jogos: <b style="color:var(--ac2)">${res.mega.cov.toFixed(3)}</b> · prox. de 0 = cobertura independente (menor sobreposicao de dezenas)</div>
      <div class="lrow" style="border:none;color:var(--mt);font-size:9px;padding-top:4px">Sena: 1 em ${mp.total.toLocaleString('pt-BR')} · Quina: ${fmtP(mp.quina)} · Quadra: ${fmtP(mp.quadra)}</div></div>
      <div class="lpnl"><div class="lh2"><i class="fas fa-trophy" style="color:var(--ac)"></i> Quina (5 de 80) — 4 jogos</div>
      ${quinaRows}
      <div class="lrow" style="border:none;color:var(--ob);font-size:9px"><i class="fas fa-link"></i> Covariancia media entre os 4 jogos: <b style="color:var(--ac2)">${res.quina.cov.toFixed(3)}</b> · prox. de 0 = cobertura independente (menor sobreposicao de dezenas)</div>
      <div class="lrow" style="border:none;color:var(--mt);font-size:9px;padding-top:4px">Quina: 1 em ${qp.total.toLocaleString('pt-BR')} · Quadra: ${fmtP(qp.quadra)} · Terno: ${fmtP(qp.terno)}</div></div>
      <div class="lpnl"><div class="lh2"><i class="fas fa-calculator"></i> Probabilidades Exatas</div>
      <div class="lpt"><div><b>Mega Sena</b><br>Sena: 1 / ${mp.total.toLocaleString('pt-BR')}<br>Quina: ${fmtP(mp.quina)}<br>Quadra: ${fmtP(mp.quadra)}</div><div><b>Quina</b><br>Quina: 1 / ${qp.total.toLocaleString('pt-BR')}<br>Quadra: ${fmtP(qp.quadra)}<br>Terno: ${fmtP(qp.terno)}</div></div></div>`;
  }
  $('bLot').addEventListener('click', rLot);

  // --- Previsoes por rodada (batch Monte Carlo) ---
  let rodIdx = 0;
  let rodRounds = [];
  function rRod() {
    const con = $('rodCon');
    if (!rodRounds.length) {
      con.innerHTML = '<div style="color:var(--mt);text-align:center;font-size:11px;padding:14px">Clique em "Gerar 12 Previsoes" para o painel de probabilidade de acerto (Monte Carlo + Dixon-Coles).</div>';
      return;
    }
    con.innerHTML = rodRounds.map(r => `
      <div class="lpnl"><div class="lhd"><i class="fas fa-dice"></i> ${r.predictions.length} previsoes · Monte Carlo 3000x · Dixon-Coles</div>
      <div class="pp-grid">
      ${r.predictions.map(p => `
        <div class="pp-card">
          <div class="pp-head"><span class="pp-hm">${p.h}</span><span class="pp-vs">vs</span><span class="pp-aw">${p.a}</span></div>
          <div class="pp-score" style="color:${p.hit>15?'var(--ac)':p.hit>8?'var(--ac2)':'var(--oo)'}">${p.score}</div>
          <div class="pp-hit-label">Prob. de acerto do placar</div>
          <div class="pp-gauge"><div class="pp-gauge-fill" style="width:${Math.min(100,p.hit)}%;background:${p.hit>15?'var(--ac)':p.hit>8?'var(--ac2)':'var(--oo)'}"></div></div>
          <div class="pp-hit-pct">${p.hit.toFixed(1)}%</div>
          <div class="pp-alt">${p.top3.map(t => `<div class="pp-alt-row"><span class="pp-sc">${t.score}</span><div class="pp-alt-bar"><div style="width:${Math.min(100,t.pct*2.5)}%"></div></div><span class="pp-pct">${t.pct.toFixed(1)}%</span></div>`).join('')}</div>
          <div class="pp-wdl"><span style="color:var(--hm)">V ${p.win}%</span><span style="color:var(--ac2)">E ${p.draw}%</span><span style="color:var(--aw)">D ${p.loss}%</span></div>
          <div class="pp-xg">xG ${p.xgH}-${p.xgA} · Fav: <b style="color:var(--ac)">${p.fav}</b></div>
        </div>`).join('')}
      </div></div>`).join('');
  }
  $('bRod').addEventListener('click', () => {
    const flat = roundRobin(B20).flat();
    rodRounds = []; rodIdx = 0;
    rodRounds.push({ idx: ++rodIdx, predictions: predictMatches(flat.slice(0, 12)) });
    rRod();
    toast('12 previsoes geradas — painel Monte Carlo', 'ok');
  });
  $('bRodAdd').addEventListener('click', () => {
    const flat = roundRobin(B20).flat();
    const off = (rodIdx * 12) % flat.length;
    rodRounds.push({ idx: ++rodIdx, predictions: predictMatches(flat.slice(off, off + 10)) });
    rRod();
    toast('Rodada ' + rodIdx + ' adicionada', 'ok');
  });

  // --- Importar estatisticas reais (CSV do Google Sheets) ---
  function rImp() {
    const imp = getStatsOverride();
    const teams = Object.keys(imp);
    const list = $('impList');
    if (!teams.length) {
      list.innerHTML = '<div style="color:var(--mt);font-size:11px;text-align:center;padding:12px">Nenhuma importacao ainda. Selecione um CSV exportado do Google Sheets.</div>';
      return;
    }
    list.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:11px;color:var(--ac)"><i class="fas fa-check-circle"></i> ${teams.length} times com dados reais — previsoes recalculadas</span><button id="bImpClear" style="padding:4px 10px;background:rgba(255,82,82,.1);border:1px solid var(--dn);color:var(--dn);border-radius:5px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:10px"><i class="fas fa-trash"></i> Limpar</button></div><div class="igl">${teams.map(t => `<div class="igi"><span class="ign">${t}</span><span class="igd">${imp[t].injuries != null ? 'Lesoes: ' + imp[t].injuries : ''}${imp[t].xG != null ? ' · xG ' + imp[t].xG : ''}</span></div>`).join('')}</div>`;
    $('bImpClear').addEventListener('click', () => { clearImport(); rImp(); rMC(); rTInd(); toast('Importacao limpa — previsoes voltaram ao baseline', 'wr'); });
  }
  $('fImp').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const rows = parseCSV(text);
      const teams = applyImport(rows);
      rImp(); rMC(); rTInd();
      toast(teams.length + ' times importados — previsoes atualizadas', 'ok');
    } catch (err) {
      toast('Erro na importacao: ' + err.message, 'wr');
    }
    e.target.value = '';
  });

  // --- Init ---
  popTS();
  popCS();
  popLF();
  rTInd();
  rMC();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(rafId);
    document.body.classList.remove('br-page');
    window.removeEventListener('resize', rsCV);
  };
}