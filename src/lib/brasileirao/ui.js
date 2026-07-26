import { PL, LG, COMP, FMS, B20, pc, pco, rc, gto, gppda, gts, gtp, getStatsOverride, Sim, CH, TPred } from './engine';
import { monteCarlo } from './predict';
import { gerarSugestoes, MODALIDADES } from './loteria';
import { getFreqTable, fetchCaixaHistory } from './caixaHistory';
import { roundRobin, predictMatches } from './rodada';
import { parseCSV, applyImport, clearImport } from './statsImport';
import { REAL_TABLE } from './realStats';
import { descriptive, pearson, linearRegression, anova, welchTTest } from './statEngine';
import { runCalibration, getMetrics, clearHistory, getHistory } from './learning';
import { getCorrections } from './corrections';
import { requestNotifyPermission, notifyRoundFinished, notifyPermission } from './notify';
import { exportAllCSV } from './export';
import { base44 } from '@/api/base44Client';

export function initBrasileirao(root) {
  document.body.classList.add('br-page');

  let SIM = null;
  let USQ = new Array(11).fill(null);
  let heatAcc = { mv: [], wp: [] };
  let tacT = 0;
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
    if (b.dataset.t === 'lot') { rLot(); rFreqChart(); }
    if (b.dataset.t === 'imp') rImp();
    if (b.dataset.t === 'rod') rRod();
    if (b.dataset.t === 'int') rInt();
    if (b.dataset.t === 'stat') rStat();
  }));

  // --- Canvas ---
  const cv = $('cv');
  function rsCV() {
    const w = cv.parentElement;
    cv.width = w.clientWidth * (window.devicePixelRatio || 1);
    cv.height = w.clientHeight * (window.devicePixelRatio || 1);
  }
  rsCV();
  const onResize = () => { rsCV(); if (document.querySelector('#freqCV')) rFreqChart(); if (document.querySelector('#heatCV')) rHeat(); };
  window.addEventListener('resize', onResize);

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

  // --- Painel tático: sugestões de substituição por queda de desempenho ---
  function rTac() {
    const box = $('tpnl');
    if (!box) return;
    if (!SIM) { box.innerHTML = '<div style="color:var(--mt);font-size:10px;text-align:center;padding:6px;font-family:Rajdhani,sans-serif">Inicie uma partida ao vivo para análise tática.</div>'; return; }
    const sug = SIM.gSub();
    if (!sug.length) { box.innerHTML = '<div style="color:var(--mt);font-size:10px;text-align:center;padding:6px;font-family:Rajdhani,sans-serif">Desempenho estável — sem substituições recomendadas.</div>'; return; }
    box.innerHTML = sug.map(s => `<div style="background:var(--cd2);border:1px solid var(--bd);border-radius:6px;padding:6px;margin-bottom:5px;font-family:Rajdhani,sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-weight:700;color:${s.tm === 'h' ? 'var(--hm)' : 'var(--aw)'};font-size:11px"><i class="fas fa-clipboard-list"></i> ${s.club}</span><span style="color:var(--mt);font-size:9px">${s.minute}'</span></div>
      <div style="display:flex;align-items:center;gap:6px;font-size:10px">
        <div style="flex:1;text-align:center;color:var(--dn)"><i class="fas fa-arrow-down"></i><div style="font-weight:700">${s.out}</div><div style="color:var(--mt);font-size:8px">${s.outPos} · perf ${s.outPerf} · ▼${s.drop}</div></div>
        <i class="fas fa-exchange-alt" style="color:var(--mt)"></i>
        <div style="flex:1;text-align:center;color:var(--ac)"><i class="fas fa-arrow-up"></i><div style="font-weight:700">${s.in}</div><div style="color:var(--mt);font-size:8px">${s.inPos}${s.hasBench ? ' · OVR ' + s.inOvr : ' · reserva'}</div></div>
      </div>
    </div>`).join('');
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
    if (SIM && SIM.heat) { heatAcc.mv.push(...SIM.heat.mv); heatAcc.wp.push(...SIM.heat.wp); if (heatAcc.mv.length > 20000) heatAcc.mv.splice(0, heatAcc.mv.length - 20000); }
    rsCV();
    SIM = new Sim(cv, h, a);
    SIM.start();
    rTac();
    toast('Partida: ' + h + ' vs ' + a, 'ok');
  });
  $('bP').addEventListener('click', () => { if (SIM) SIM.pause(); });
  $('bQ').addEventListener('click', () => {
    const h = $('ht').value, a = $('at').value;
    if (h === a) { toast('Selecione times diferentes!', 'wr'); return; }
    if (SIM && SIM.heat) { heatAcc.mv.push(...SIM.heat.mv); heatAcc.wp.push(...SIM.heat.wp); if (heatAcc.mv.length > 20000) heatAcc.mv.splice(0, heatAcc.mv.length - 20000); }
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
    rTac();
  });
  $('bSp').addEventListener('click', () => {
    si = (si + 1) % speeds.length;
    if (SIM) SIM.setSpd(speeds[si]);
    $('bSp').innerHTML = '<i class="fas fa-forward"></i> ' + speeds[si] + 'x';
  });

  $('bCal').addEventListener('click', async () => {
    if (!SIM) { toast('Simule uma partida primeiro (Iniciar ou Rapido)!', 'wr'); return; }
    const dt = $('calDT').value;
    if (!dt) { toast('Selecione data e hora', 'wr'); return; }
    const startISO = new Date(dt).toISOString();
    const msg = $('calMsg');
    msg.innerHTML = '<span style="color:var(--ob)"><i class="fas fa-spinner fa-spin"></i> Agendando no Google Calendar...</span>';
    try {
      const r = await base44.functions.invoke('scheduleMatch', {
        home: SIM.hc, away: SIM.ac,
        scoreH: SIM.sc2.h, scoreA: SIM.sc2.a,
        xgH: +SIM.xg.h.toFixed(2), xgA: +SIM.xg.a.toFixed(2),
        startISO
      });
      const data = r.data || r;
      if (data && data.ok) {
        msg.innerHTML = `<a href="${data.htmlLink}" target="_blank" style="color:var(--ac)"><i class="fas fa-check-circle"></i> Evento criado - abrir no Calendar</a>`;
        toast('Partida agendada no Google Calendar!', 'ok');
      } else {
        msg.innerHTML = `<span style="color:var(--dn)"><i class="fas fa-exclamation-circle"></i> ${(data && data.error) || 'Erro ao agendar'}</span>`;
      }
    } catch (e) {
      msg.innerHTML = `<span style="color:var(--dn)">Falha: ${e.message}</span>`;
    }
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
      tacT += dt;
      if (tacT >= 1) { tacT = 0; rTac(); }
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

  // --- Loteria (Mega Sena, Quina & Lotofacil) ---
  function updLotSrc() {
    const tag = { baseline: 'Baseline', caixa: 'Caixa', 'caixa-db': 'Caixa DB' };
    if ($('lotSrc')) {
      $('lotSrc').textContent = ['mega', 'quina', 'lotofacil']
        .map(k => MODALIDADES[k].name + ': ' + (tag[getFreqTable(k).source] || 'Baseline')).join(' · ');
    }
  }
  function rLot() {
    const ft = { mega: getFreqTable('mega'), quina: getFreqTable('quina'), lotofacil: getFreqTable('lotofacil') };
    const res = gerarSugestoes(ft);
    updLotSrc();
    const ball = (n, big) => `<span class="lb${big ? ' bg' : ''}">${n}</span>`;
    const setHTML = (g, big) => g.nums.map(n => ball(n, big)).join('') + `<span class="lq" style="color:${rc(g.q)}">${g.q}%</span>`;
    const labels = Array.from({ length: 12 }, (_, i) => i === 0 ? 'Jogo 1 (melhor chance)' : 'Jogo ' + (i + 1));
    const fmtP = p => p < 1e-4 ? (p * 1e6).toFixed(2) + ' ppm' : (p * 100).toFixed(4) + '%';
    const ruRows = (arr) => arr.map((g, i) => `<div class="lrow"><span class="lrt">Reuso ${i + 1}</span><div class="lballs">${g.nums.map(n => ball(n, false)).join('')}<span class="lq" style="color:${rc(g.q)}">${g.q}%</span></div><span class="lpr">pool ${g.pool}</span></div>`).join('');
    const srcTag = s => s === 'caixa' ? '<span style="color:var(--ob)">Caixa</span>' : '<span style="color:var(--mt)">Baseline</span>';
    const modBlock = (key) => {
      const mod = MODALIDADES[key];
      const data = res[key];
      const rows = data.games.map((g, i) => `<div class="lrow"><span class="lrt">${labels[i]}</span><div class="lballs">${setHTML(g, i === 0)}</div><span class="lpr">chance ${g.q}%</span></div>`).join('');
      const prob = res.prob[key];
      let probLine;
      if (key === 'mega') probLine = `Sena: 1 em ${prob.total.toLocaleString('pt-BR')} · Quina: ${fmtP(prob.quina)} · Quadra: ${fmtP(prob.quadra)}`;
      else if (key === 'quina') probLine = `Quina: 1 em ${prob.total.toLocaleString('pt-BR')} · Quadra: ${fmtP(prob.quadra)} · Terno: ${fmtP(prob.terno)}`;
      else probLine = `15 pts: 1 em ${prob.total.toLocaleString('pt-BR')} · 14: ${fmtP(prob.faixa14)} · 12: ${fmtP(prob.faixa12)} · 11: ${fmtP(prob.faixa11)}`;
      return `<div class="lpnl"><div class="lh2"><i class="fas fa-trophy" style="color:var(--${mod.ac})"></i> ${mod.name} (${mod.disc}) — 12 jogos</div>
      ${rows}
      <div class="lrow" style="border:none;color:var(--ob);font-size:9px"><i class="fas fa-link"></i> Covariancia media: <b style="color:var(--ac2)">${data.cov.toFixed(3)}</b> · fonte: ${srcTag(data.source)}</div>
      <div class="lrow" style="border:none;color:var(--mt);font-size:9px;padding-top:4px">${probLine}</div></div>`;
    };
    const reuseBlock = (key) => {
      const mod = MODALIDADES[key];
      return `<div class="lh2" style="font-size:12px;margin-top:8px"><i class="fas fa-trophy" style="color:var(--${mod.ac})"></i> ${mod.name}</div>${ruRows(res.reuso[key])}`;
    };
    $('lcon').innerHTML = `
      <div class="lpnl"><div class="lhd"><i class="fas fa-calendar-day"></i> Sugestoes para ${res.date}</div>
      <div class="ldisc"><i class="fas fa-info-circle"></i> Geracao estocastica sobre o historico de 6 anos da Caixa: <b>70% dezenas frias</b> (menos sorteadas) + <b>30% dezenas quentes</b> (mais sorteadas). Seed diaria + combinatoria exata + balanceamento + matriz de covariancia (baixa correlacao entre jogos). 12 jogos por modalidade ordenados por maior chance. Loteria e aleatoria — nao garante premio.</div></div>
      ${modBlock('mega')}
      ${modBlock('quina')}
      ${modBlock('lotofacil')}
      <div class="lpnl"><div class="lh2"><i class="fas fa-recycle" style="color:var(--ob)"></i> Reaproveitamento - 3 apostas reutilizando os numeros dos 12 jogos</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;padding:6px 8px;background:var(--cd2);border-radius:5px;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Numeros sorteados aleatoriamente apenas do pool formado pelos 12 jogos de cada modalidade.</div>
      ${reuseBlock('mega')}
      ${reuseBlock('quina')}
      ${reuseBlock('lotofacil')}
      </div>
      <div class="lpnl"><div class="lh2"><i class="fas fa-calculator"></i> Probabilidades Exatas</div>
      <div class="lpt"><div><b>Mega Sena</b><br>Sena: 1 / ${res.prob.mega.total.toLocaleString('pt-BR')}<br>Quina: ${fmtP(res.prob.mega.quina)}<br>Quadra: ${fmtP(res.prob.mega.quadra)}</div><div><b>Quina</b><br>Quina: 1 / ${res.prob.quina.total.toLocaleString('pt-BR')}<br>Quadra: ${fmtP(res.prob.quina.quadra)}<br>Terno: ${fmtP(res.prob.quina.terno)}</div></div>
      <div class="lpt" style="margin-top:6px"><div><b>Lotofacil</b><br>15 pts: 1 / ${res.prob.lotofacil.total.toLocaleString('pt-BR')}<br>14: ${fmtP(res.prob.lotofacil.faixa14)} · 12: ${fmtP(res.prob.lotofacil.faixa12)} · 11: ${fmtP(res.prob.lotofacil.faixa11)}</div></div></div>`;
  }
  $('bLot').addEventListener('click', rLot);
  if ($('freqMod')) $('freqMod').addEventListener('change', rFreqChart);

  // --- Gráfico de frequência dos números (6 anos Caixa) ---
  function rFreqChart() {
    const cv = $('freqCV');
    if (!cv) return;
    const mod = $('freqMod').value;
    const ft = getFreqTable(mod);
    const table = ft.table;
    const max = Math.max(...table), min = Math.min(...table);
    $('freqInfo').textContent = `fonte: ${ft.source} · ${table.length} dezenas · máx ${max} · mín ${min}`;
    const host = cv.parentElement;
    const cssW = host.clientWidth || 600;
    const cssH = 280;
    const dpr = window.devicePixelRatio || 1;
    cv.width = cssW * dpr; cv.height = cssH * dpr;
    cv.style.width = cssW + 'px'; cv.style.height = cssH + 'px';
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const n = table.length;
    const padL = 34, padB = 22, padT = 8, padR = 6;
    const cw = (cssW - padL - padR) / n;
    const chartH = cssH - padB - padT;
    ctx.strokeStyle = '#2a3140'; ctx.fillStyle = '#6b7682';
    ctx.font = '9px Rajdhani, sans-serif'; ctx.textAlign = 'right';
    for (let g = 0; g <= 4; g++) {
      const y = padT + chartH * (g / 4);
      const val = Math.round(max - (max - min) * (g / 4));
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(cssW - padR, y); ctx.stroke();
      ctx.fillText(String(val), padL - 3, y + 3);
    }
    const lerp = (a, b, t) => a + (b - a) * t;
    const hexRgb = h => { const v = parseInt(h.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; };
    const cold = hexRgb('#29b6f6'), mid = hexRgb('#ffd400'), hot = hexRgb('#00e676');
    const colorFor = r => {
      const pair = r < 0.5 ? [cold, mid, r * 2] : [mid, hot, (r - 0.5) * 2];
      const [a, b, t] = pair;
      return `rgb(${lerp(a[0], b[0], t) | 0},${lerp(a[1], b[1], t) | 0},${lerp(a[2], b[2], t) | 0})`;
    };
    for (let i = 0; i < n; i++) {
      const r = max === min ? 0.5 : (table[i] - min) / (max - min);
      const bh = chartH * (0.08 + 0.92 * r);
      const x = padL + i * cw;
      ctx.fillStyle = colorFor(r);
      ctx.fillRect(x + Math.max(0.5, cw * 0.12), padT + chartH - bh, cw * 0.76, bh);
    }
    ctx.fillStyle = '#8a93a0'; ctx.textAlign = 'center'; ctx.font = '8px Rajdhani, sans-serif';
    const step = n <= 25 ? 1 : n <= 60 ? 2 : 4;
    for (let i = 0; i < n; i += step) {
      ctx.fillText(String(i + 1), padL + i * cw + cw / 2, cssH - 6);
    }
    const ranked = table.map((f, i) => ({ n: i + 1, f })).sort((a, b) => b.f - a.f);
    const hot6 = ranked.slice(0, 6), cold6 = ranked.slice(-6).reverse();
    const chip = (num, f, isHot) => `<span style="display:inline-flex;align-items:center;gap:3px;background:${isHot ? 'rgba(0,230,118,.12)' : 'rgba(41,182,246,.12)'};border:1px solid ${isHot ? 'var(--ac)' : 'var(--ob)'};border-radius:12px;padding:2px 7px;margin:2px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:10px;color:${isHot ? 'var(--ac)' : 'var(--ob)'}">${num} <span style="color:var(--mt);font-weight:400">${f}x</span></span>`;
    $('freqChips').innerHTML = `<div style="font-size:9px;color:var(--mt);margin-bottom:2px"><i class="fas fa-fire" style="color:var(--ac)"></i> Mais sorteadas (quentes)</div>${hot6.map(x => chip(x.n, x.f, true)).join('')}<div style="font-size:9px;color:var(--mt);margin:6px 0 2px"><i class="fas fa-snowflake" style="color:var(--ob)"></i> Menos sorteadas (frias)</div>${cold6.map(x => chip(x.n, x.f, false)).join('')}`;
  }
  $('bCaixa').addEventListener('click', async () => {
    const btn = $('bCaixa');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btn.disabled = true;
    try {
      await fetchCaixaHistory();
      rLot();
      toast('Historico da Caixa atualizado ao vivo!', 'ok');
    } catch (e) {
      toast('Falha na busca Caixa: ' + e.message, 'wr');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  });

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
    notifyRoundFinished(rodIdx, 12);
  });
  $('bRodAdd').addEventListener('click', () => {
    const flat = roundRobin(B20).flat();
    const off = (rodIdx * 12) % flat.length;
    const batch = predictMatches(flat.slice(off, off + 10));
    rodRounds.push({ idx: ++rodIdx, predictions: batch });
    rRod();
    toast('Rodada ' + rodIdx + ' adicionada', 'ok');
    notifyRoundFinished(rodIdx, batch.length);
  });
  $('bNotif').addEventListener('click', async () => {
    const perm = await requestNotifyPermission();
    if (perm === 'granted') { toast('Notificações ativadas — você será avisado ao finalizar cada rodada.', 'ok'); updateNotifBtn(); }
    else if (perm === 'denied') toast('Notificações bloqueadas pelo navegador.', 'wr');
    else toast('Permissão de notificação não concedida.', 'wr');
  });
  function updateNotifBtn() {
    const btn = $('bNotif'); if (!btn) return;
    const p = notifyPermission();
    if (p === 'granted') { btn.innerHTML = '<i class="fas fa-bell"></i> Notificações Ativas'; btn.disabled = true; btn.style.opacity = '.6'; btn.style.cursor = 'default'; }
    else if (p === 'denied') btn.innerHTML = '<i class="fas fa-bell-slash"></i> Bloqueado';
    else btn.innerHTML = '<i class="fas fa-bell"></i> Ativar Notificações';
  }
  updateNotifBtn();

  // --- Estatistica (motor open-source estilo SPSS/Minitab/R) ---
  function corrColor(r) {
    const a = Math.min(1, Math.abs(r));
    return r >= 0 ? `rgba(0,230,118,${a * 0.55})` : `rgba(255,82,82,${a * 0.55})`;
  }
  function rStat() {
    const VARS = ['ovr', 'xG', 'def', 'gk', 'atk', 'mid', 'ppda', 'pas', 'conv', 'pts'];
    const VN = { ovr: 'OVR', xG: 'xG', def: 'DEF', gk: 'GK', atk: 'ATK', mid: 'MID', ppda: 'PPDA', pas: 'Passe%', conv: 'Conv%', pts: 'Pontos' };
    const data = B20.map(t => {
      const s = gts(t); const rt = REAL_TABLE.find(r => r.team === t);
      return { team: t, ovr: s.ovr, xG: s.xG, def: s.def, gk: s.gk, atk: s.atk, mid: s.mid, ppda: s.ppda, pas: s.pas, conv: s.conv, pts: rt ? rt.pts : 0 };
    });
    const col = v => data.map(d => d[v]);
    const descRows = VARS.map(v => {
      const d = descriptive(col(v));
      return `<tr><td>${VN[v]}</td><td>${d.n}</td><td>${d.mean.toFixed(2)}</td><td>${d.sd.toFixed(2)}</td><td>${d.min}</td><td>${d.q1.toFixed(1)}</td><td>${d.median.toFixed(1)}</td><td>${d.q3.toFixed(1)}</td><td>${d.max}</td><td>${d.skew.toFixed(2)}</td><td>${d.kurt.toFixed(2)}</td><td>${(d.cv * 100).toFixed(1)}%</td></tr>`;
    }).join('');
    const corrHead = VARS.map(v => `<div class="corr-h">${VN[v]}</div>`).join('');
    const corrRows = VARS.map(rv => {
      const head = `<div class="corr-lbl">${VN[rv]}</div>`;
      const cells = VARS.map(cv => {
        const r = pearson(col(rv), col(cv));
        return `<div class="corr-cell" style="background:${corrColor(r)};color:${Math.abs(r) > 0.6 ? '#fff' : 'var(--tx)'}">${r.toFixed(2)}</div>`;
      }).join('');
      return head + cells;
    }).join('');
    const regVar = $('regVar') ? $('regVar').value : 'ovr';
    const reg = linearRegression(col(regVar), col('pts'));
    const sorted = [...data].sort((a, b) => b.pts - a.pts);
    const top = sorted.slice(0, 10), bot = sorted.slice(10);
    const aVar = $('aVar') ? $('aVar').value : 'xG';
    const an = anova([top.map(d => d[aVar]), bot.map(d => d[aVar])]);
    const wel = welchTTest(top.map(d => d[aVar]), bot.map(d => d[aVar]));
    const sig = p => p < 0.001 ? '***' : p < 0.01 ? '**' : p < 0.05 ? '*' : 'ns';
    $('statCon').innerHTML = `
      <div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-table"></i> Estatistica Descritiva (n=${data.length} times) — estilo SPSS/Minitab</div>
        <div style="overflow-x:auto"><table class="st-tbl"><tr><th>Var</th><th>n</th><th>Media</th><th>DP</th><th>Min</th><th>Q1</th><th>Med</th><th>Q3</th><th>Max</th><th>Assym</th><th>Curt</th><th>CV</th></tr>${descRows}</table></div></div>
      <div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-th"></i> Matriz de Correlacao (Pearson)</div>
        <div class="corr-mx" style="--n:${VARS.length}"><div></div>${corrHead}${corrRows}</div>
        <div style="font-size:9px;color:var(--mt);margin-top:4px">Verde=correlacao positiva · Vermelho=negativa · intensidade proporcional a |r| · *** p&lt;0.001 ** p&lt;0.01 * p&lt;0.05</div></div>
      <div class="st-grid">
        <div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-chart-line"></i> Regressao Linear OLS — Pontos ~ preditor</div>
          <div style="margin-bottom:6px"><select id="regVar" class="psr" style="width:auto">${VARS.filter(v => v !== 'pts').map(v => `<option value="${v}" ${v === regVar ? 'selected' : ''}>${VN[v]}</option>`).join('')}</select></div>
          <div style="font-size:11px;line-height:1.7">
            <div>Equacao: <b style="color:var(--ac)">Pontos = ${reg.slope.toFixed(3)} × ${VN[regVar]} + ${reg.intercept.toFixed(2)}</b></div>
            <div>R² = <b style="color:var(--ac2)">${reg.r2.toFixed(3)}</b> (r = ${reg.r.toFixed(3)}) · gl = ${reg.df}</div>
            <div>Inclinacao = ${reg.slope.toFixed(3)} ± ${reg.se.toFixed(3)} · t = ${reg.t.toFixed(2)} · p = ${reg.p.toExponential(2)} ${sig(reg.p)}</div>
          </div></div>
        <div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-layer-group"></i> ANOVA + t-Welch — Top10 vs Bottom10 (por pontos)</div>
          <div style="margin-bottom:6px"><select id="aVar" class="psr" style="width:auto">${VARS.filter(v => v !== 'pts').map(v => `<option value="${v}" ${v === aVar ? 'selected' : ''}>${VN[v]}</option>`).join('')}</select></div>
          <div style="font-size:11px;line-height:1.7">
            <div>ANOVA: F(${an.dfB},${an.dfW}) = <b style="color:var(--ac2)">${an.F.toFixed(2)}</b> · p = ${an.p.toExponential(2)} ${sig(an.p)}</div>
            <div>SSB=${an.ssB.toFixed(2)} · SSW=${an.ssW.toFixed(2)} · MSB=${an.msB.toFixed(2)} · MSW=${an.msW.toFixed(2)}</div>
            <div>t-Welch: t(${wel.df.toFixed(1)}) = ${wel.t.toFixed(2)} · p = ${wel.p.toExponential(2)} ${sig(wel.p)} · Δmedia = ${wel.meanDiff.toFixed(2)}</div>
          </div></div>
      </div>
      <div class="pnl" style="padding:8px"><div style="font-size:10px;color:var(--mt);line-height:1.5"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Motor estatistico open-source em JS puro (algoritmos de dominio publico): lgamma (Lanczos), beta incompleta regularizada (Numerical Recipes), distribuicoes t e F, OLS, ANOVA, Pearson/Spearman. Equivalentes em metodo ao R / PSPP / jamovi / Minitab — nenhum binario ou codigo privado utilizado.</div></div>`;
    if ($('regVar')) $('regVar').addEventListener('change', rStat);
    if ($('aVar')) $('aVar').addEventListener('change', rStat);
  }

  // --- Intuição & Aprendizado ---
  function metricsHTML(m, c) {
    const row = (l, a, b, good) => `<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;border-bottom:1px solid var(--bd)"><span style="color:var(--mt)">${l}</span><span style="font-family:Rajdhani,sans-serif;font-weight:700;color:${good ? 'var(--ac)' : 'var(--oo)'}">${a} vs ${b}</span></div>`;
    return `<div style="font-size:11px;line-height:1.7;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between"><span style="color:var(--mt)">Partidas avaliadas</span><b style="font-family:Rajdhani">${m.n}</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--mt)">Acerto do favorito</span><b style="font-family:Rajdhani;color:var(--ac2)">${m.accuracy}%</b></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--mt)">Brier score (menor=melhor)</span><b style="font-family:Rajdhani;color:var(--ob)">${m.brier}</b></div>
      ${row('Vitória casa (%)', m.predHomeRate, m.actHomeRate, Math.abs(m.predHomeRate - m.actHomeRate) < 5)}
      ${row('Empates (%)', m.predDrawRate, m.actDrawRate, Math.abs(m.predDrawRate - m.actDrawRate) < 5)}
      ${row('Gols/jogo', m.predGoals, m.actGoals, Math.abs(m.predGoals - m.actGoals) < 0.4)}
      </div>
      <div class="pt" style="border:none;margin:6px 0 4px"><i class="fas fa-wrench"></i> Correções aprendidas (aplicadas nas próximas previsões)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;font-size:10px">
        <div style="background:var(--cd2);padding:6px;border-radius:5px"><div style="color:var(--mt)">Mando de campo</div><b style="font-family:Rajdhani;color:var(--ac2)">${c.homeAdv}</b></div>
        <div style="background:var(--cd2);padding:6px;border-radius:5px"><div style="color:var(--mt)">Viés empate</div><b style="font-family:Rajdhani;color:var(--ac2)">${c.drawBias}</b></div>
        <div style="background:var(--cd2);padding:6px;border-radius:5px"><div style="color:var(--mt)">Escala gols</div><b style="font-family:Rajdhani;color:var(--ac2)">${c.goalScale}</b></div>
      </div>`;
  }
  function rInt() {
    const m = getMetrics();
    const c = getCorrections();
    $('intCon').innerHTML = `
      <div class="pnl" style="padding:8px"><div class="pt"><i class="fas fa-brain"></i> Intuição & Aprendizado — calibração do motor de previsão</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px">Compara as probabilidades previstas (Monte Carlo + Elo + Dixon-Coles) com os resultados simulados das mesmas partidas, calcula acerto/Brier/viés e aprende correções (mando de campo, empate, gols) que passam a ser aplicadas nas próximas previsões.</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">
        <button id="bCalib" style="padding:6px 12px;background:rgba(0,230,118,.1);border:1px solid var(--ac);color:var(--ac);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-bolt"></i> Calibrar (10 partidas)</button>
        <button id="bIntAI" style="padding:6px 12px;background:rgba(99,102,241,.12);border:1px solid #6366f1;color:#818cf8;border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-robot"></i> Intuição IA</button>
        <button id="bRel" style="padding:6px 12px;background:rgba(41,182,246,.12);border:1px solid var(--ob);color:var(--ob);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-file-medical-alt"></i> Relatório</button>
        <button id="bHeat" style="padding:6px 12px;background:rgba(255,120,40,.1);border:1px solid #ff7820;color:#ff9b4d;border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-fire"></i> Mapa de Calor</button>
        <button id="bIntClr" style="padding:6px 12px;background:rgba(255,82,82,.1);border:1px solid var(--dn);color:var(--dn);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-trash"></i> Limpar</button>
        <button id="bExp" style="padding:6px 12px;background:rgba(41,182,246,.12);border:1px solid var(--ob);color:var(--ob);border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px"><i class="fas fa-file-csv"></i> Exportar CSV</button>
      </div>
      <div id="intMetrics">${m ? metricsHTML(m, c) : '<div style="color:var(--mt);font-size:11px;padding:6px">Nenhum dado ainda. Clique em Calibrar.</div>'}</div>
      <div id="intAI" style="margin-top:6px"></div>
      <div id="intHeat" style="margin-top:6px"></div>
      </div>`;
    $('bCalib').onclick = () => {
      const ms = roundRobin(B20).flat().slice(0, 10);
      const r = runCalibration(ms);
      rInt();
      toast('Calibração: ' + r.metrics.n + ' partidas · acerto ' + r.metrics.accuracy + '%', 'ok');
    };
    $('bIntAI').onclick = rIntAI;
    $('bRel').onclick = rIntRelatorio;
    $('bHeat').onclick = rHeat;
    $('bIntClr').onclick = () => { clearHistory(); rInt(); toast('Histórico e correções limpos', 'wr'); };
    $('bExp').onclick = async () => {
      toast('Exportando histórico...', 'ok');
      try {
        const r = await exportAllCSV();
        if (!r.sim && !r.lot) toast('Nenhum dado para exportar (rode calibração e busque a loteria).', 'wr');
        else toast('Exportado: ' + (r.sim ? 'simulações ' : '') + (r.lot ? 'loteria ' : '') + '→ CSV', 'ok');
      } catch (e) { toast('Falha na exportação: ' + e.message, 'wr'); }
    };
    rHeat();
  }
  async function rIntAI() {
    const h = $('ht').value, a = $('at').value;
    const box = $('intAI');
    box.innerHTML = '<div class="ild">Gerando intuição com IA...</div>';
    const hs = gts(h), as = gts(a);
    const hp = gtp(h).sort((x, y) => y.ovr - x.ovr).slice(0, 11).map(p => `${p.name}(${p.pos} OVR${p.ovr} xG${p.xG90} xA${p.xA90} pas${p.passComp} drib${p.duelWin})`).join('; ');
    const ap = gtp(a).sort((x, y) => y.ovr - x.ovr).slice(0, 11).map(p => `${p.name}(${p.pos} OVR${p.ovr})`).join('; ');
    const c = getCorrections();
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um analista tático de futebol. Para ${h} (mandante) vs ${a} (visitante) no Brasileirão 2026, desenvolva uma "intuição" analítica baseada em dados. Estatísticas do ${h}: OVR ${hs.ovr}, ataque ${hs.atk}, meio ${hs.mid}, defesa ${hs.def}, goleiro ${hs.gk}, xG ${hs.xG}, xA ${hs.xA}, passe ${hs.pas}%, PPDA ${hs.ppda}. Estatísticas do ${a}: OVR ${as.ovr}, ataque ${as.atk}, defesa ${as.def}, goleiro ${as.gk}, xG ${as.xG}. Titulares ${h}: ${hp}. Titulares ${a}: ${ap}. Correções aprendidas do motor: mando ${c.homeAdv}, viés empate ${c.drawBias}, escala gols ${c.goalScale}. Analise de forma concisa e direta: (1) quem deveria iniciar vs reservas; (2) avaliação de goleiros e lideranças; (3) fatores táticos — passes certos/errados, construção/saída de bola, alas esquerdo/direito, velocidade, cabeceios, cruzamentos, faltas, escanteios, dribles, defesa de meio e de área; (4) arbitragem/VAR/penalidades como fator de risco; (5) viés detectado no motor e como a intuição o corrige.`,
        add_context_from_internet: true
      });
      const txt = typeof res === 'string' ? res : JSON.stringify(res);
      box.innerHTML = `<div class="pnl" style="padding:8px;background:var(--cd2)"><div class="pt" style="border:none;margin:0 0 4px"><i class="fas fa-robot"></i> Relatório de Intuição — ${h} x ${a}</div><div style="font-size:11px;line-height:1.6;white-space:pre-wrap">${txt}</div></div>`;
    } catch (e) {
      box.innerHTML = '<div style="color:var(--dn);font-size:11px">Falha: ' + e.message + '</div>';
    }
  }

  // --- Relatório detalhado: previsões passadas vs resultados reais ---
  function rIntRelatorio() {
    const hist = getHistory();
    const c = getCorrections();
    const box = $('intAI');
    if (!hist || !hist.length) {
      box.innerHTML = '<div class="pnl" style="padding:8px;background:var(--cd2);color:var(--mt);font-size:11px">Sem histórico ainda. Clique em <b>Calibrar</b> (uma ou mais vezes) para gerar previsões e resultados comparáveis.</div>';
      return;
    }
    const errType = (r) => {
      const fav = r.pred.win >= r.pred.draw && r.pred.win >= r.pred.loss ? 'W'
        : r.pred.draw >= r.pred.loss ? 'D' : 'L';
      const hit = fav === r.act.outcome;
      if (hit) return { hit: true, tag: 'Acerto', cls: 'ok' };
      // diagnosticar o tipo de erro
      const predFavStrong = Math.max(r.pred.win, r.pred.draw, r.pred.loss);
      const confGap = predFavStrong - Math.min(r.pred.win, r.pred.draw, r.pred.loss);
      if (r.act.outcome === 'D' && fav !== 'D') return { hit: false, tag: 'Subestimou empate', cls: 'wr' };
      if (fav === 'D' && r.act.outcome !== 'D') return { hit: false, tag: 'Superestimou empate', cls: 'wr' };
      if (fav === 'W' && r.act.outcome === 'L') return { hit: false, tag: 'Inverteu mando', cls: 'dn' };
      if (fav === 'L' && r.act.outcome === 'W') return { hit: false, tag: 'Subestimou mando', cls: 'dn' };
      if (confGap < 8) return { hit: false, tag: 'Jogo equilibrado (decisão de cabo)', cls: 'wr' };
      return { hit: false, tag: 'Favorito errou', cls: 'dn' };
    };
    const rows = [...hist].reverse().map((r, i) => {
      const e = errType(r);
      const fav = r.pred.win >= r.pred.draw && r.pred.win >= r.pred.loss ? 'VIT ' + r.h
        : r.pred.draw >= r.pred.loss ? 'EMP' : 'VIT ' + r.a;
      const real = r.act.outcome === 'W' ? r.h : r.act.outcome === 'L' ? r.a : 'Empate';
      const predScore = `${Math.round(r.pred.xgH)}x${Math.round(r.pred.xgA)}`;
      const realScore = `${r.act.h}x${r.act.a}`;
      const colorCls = e.cls;
      const col = e.cls === 'ok' ? 'var(--ac)' : e.cls === 'wr' ? 'var(--ac2)' : 'var(--dn)';
      const bar = (p, col) => `<div style="display:flex;align-items:center;gap:3px"><span style="width:24px;font-size:8px;color:var(--mt)">${p.label}</span><div style="flex:1;height:4px;background:var(--bd);border-radius:2px;overflow:hidden"><div style="height:100%;width:${p.v}%;background:${col}"></div></div><span style="width:32px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:9px;text-align:right">${p.v}%</span></div>`;
      return `<div class="rrow ${colorCls}">
        <div class="rrow-h"><span class="rrow-i">#${hist.length - i}</span><span class="rrow-m">${r.h} x ${r.a}</span><span class="rrow-fav">Fav: <b>${fav}</b></span></div>
        <div class="rrow-bars">
          ${bar({label:'V', v:r.pred.win}, 'var(--hm)')}
          ${bar({label:'E', v:r.pred.draw}, 'var(--ac2)')}
          ${bar({label:'D', v:r.pred.loss}, 'var(--aw)')}
        </div>
        <div class="rrow-res">
          <span>Prev: <b style="color:var(--oo)">${predScore}</b></span>
          <span>Real: <b style="color:var(--ac)">${realScore}</b></span>
          <span>Resultou: <b style="color:${col}">${real}</b></span>
        </div>
        <div class="rrow-tag" style="color:${col}">${e.tag}</div>
      </div>`;
    }).join('');
    // agrega contagem de tipos de erro
    const stats = { acertos: 0, subEmp: 0, supEmp: 0, invMando: 0, subMando: 0, equilibrado: 0, favErrou: 0 };
    hist.forEach(r => {
      const e = errType(r);
      if (e.hit) stats.acertos++;
      else if (e.tag === 'Subestimou empate') stats.subEmp++;
      else if (e.tag === 'Superestimou empate') stats.supEmp++;
      else if (e.tag === 'Inverteu mando') stats.invMando++;
      else if (e.tag === 'Subestimou mando') stats.subMando++;
      else if (e.tag === 'Jogo equilibrado (decisão de cabo)') stats.equilibrado++;
      else stats.favErrou++;
    });
    const n = hist.length;
    // diagnosticar ajuste de pesos
    const m = getMetrics();
    const diag = [];
    if (m.actHomeRate > m.predHomeRate + 3) diag.push({ v: 'homeAdv', up: true, txt: `Mando de campo subestimado — real ${m.actHomeRate}% vs prev ${m.predHomeRate}%. Aumentando peso.` });
    else if (m.predHomeRate > m.actHomeRate + 3) diag.push({ v: 'homeAdv', up: false, txt: `Mando superestimado — real ${m.actHomeRate}% vs prev ${m.predHomeRate}%. Reduzindo peso.` });
    if (m.actDrawRate > m.predDrawRate + 3) diag.push({ v: 'drawBias', up: true, txt: `Empates subestimados — real ${m.actDrawRate}% vs prev ${m.predDrawRate}%. Aumentando viés de empate.` });
    else if (m.predDrawRate > m.actDrawRate + 3) diag.push({ v: 'drawBias', up: false, txt: `Empates superestimados — real ${m.actDrawRate}% vs prev ${m.predDrawRate}%. Reduzindo viés de empate.` });
    if (m.actGoals > m.predGoals + 0.3) diag.push({ v: 'goalScale', up: true, txt: `Gols subestimados — real ${m.actGoals}/jogo vs prev ${m.predGoals}. Aumentando escala de gols.` });
    else if (m.predGoals > m.actGoals + 0.3) diag.push({ v: 'goalScale', up: false, txt: `Gols superestimados — real ${m.actGoals}/jogo vs prev ${m.predGoals}. Reduzindo escala de gols.` });
    if (!diag.length) diag.push({ v: '-', up: null, txt: 'Sem viés sistemático relevante — motor calibrado dentro da tolerância.' });
    const corrRows = [
      { k: 'homeAdv', label: 'Mando de campo', val: c.homeAdv, def: 0.18, hint: 'Multiplica o ataque do mandante no Dixon-Coles' },
      { k: 'drawBias', label: 'Viés de empate', val: c.drawBias, def: 1, hint: 'Repondera placares iguais na grade Poisson' },
      { k: 'goalScale', label: 'Escala de gols', val: c.goalScale, def: 1, hint: 'Multiplica lambdaH/lambdaA no Monte Carlo' }
    ].map(x => {
      const delta = x.val - x.def;
      const arr = delta > 0.005 ? '▲' : delta < -0.005 ? '▼' : '·';
      const col = delta > 0.005 ? 'var(--ac)' : delta < -0.005 ? 'var(--dn)' : 'var(--mt)';
      return `<div class="cw-card"><div class="cw-h">${x.label}</div><div class="cw-val" style="color:${col}">${x.val}<span class="cw-arr">${arr}</span></div><div class="cw-def">base ${x.def} · ${x.hint}</div></div>`;
    }).join('');
    box.innerHTML = `
      <div class="pnl" style="padding:8px;margin-top:6px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-file-medical-alt"></i> Relatório Detalhado — ${n} previsões vs resultados reais</div>
        <div class="rel-sum">
          <div class="rel-sum-ok">Acertos: <b style="color:var(--ac)">${stats.acertos}/${n}</b> (${(stats.acertos/n*100).toFixed(1)}%)</div>
          <div class="rel-sum-wr">Subestimou empate: <b>${stats.subEmp}</b></div>
          <div class="rel-sum-wr">Superestimou empate: <b>${stats.supEmp}</b></div>
          <div class="rel-sum-dn">Inverteu mando: <b>${stats.invMando}</b></div>
          <div class="rel-sum-dn">Subestimou mando: <b>${stats.subMando}</b></div>
          <div class="rel-sum-wr">Equilibrado: <b>${stats.equilibrado}</b></div>
          <div class="rel-sum-dn">Favorito errou: <b>${stats.favErrou}</b></div>
        </div>
        <div class="rel-diag">${diag.map(d => `<div class="rel-diag-row"><i class="fas fa-${d.up === null ? 'check' : d.up ? 'arrow-up' : 'arrow-down'}" style="color:${d.up === null ? 'var(--ac)' : d.up ? 'var(--ac)' : 'var(--dn)'}"></i> ${d.txt}</div>`).join('')}</div>
      </div>
      <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-sliders-h"></i> Ajuste de pesos aplicado às próximas previsões</div>
        <div class="cw-grid">${corrRows}</div>
        <div style="font-size:9px;color:var(--mt);margin-top:5px;line-height:1.4">▲ acima do baseline (peso aumentado) · ▼ abaixo (peso reduzido) · · dentro da tolerância. Os pesos entram no Dixon-Coles e no Monte Carlo das próximas simulações.</div>
      </div>
      <div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-list-ol"></i> Previsões vs resultados (mais recente primeiro)</div>
        <div class="rel-list">${rows}</div>
      </div>`;
  }

  // --- Mapa de calor: movimentação & passes errados ---
  function rHeat() {
    const box = $('intHeat');
    if (!box) return;
    const mv = heatAcc.mv.concat(SIM ? SIM.heat.mv : []);
    const wp = heatAcc.wp.concat(SIM ? SIM.heat.wp : []);
    const nP = Math.round(mv.length / 2), nW = Math.round(wp.length / 2);
    box.innerHTML = `<div class="pnl" style="padding:8px"><div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-fire"></i> Mapa de Calor — movimentação & passes errados</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Agrega a movimentação dos jogadores de linha durante as simulações ao vivo (Partida → Iniciar). Zonas quentes (laranja → amarelo/branco) indicam maior concentração de jogadores; pontos <span style="color:var(--dn)">vermelhos</span> marcam a origem dos passes errados (precisão &lt; 60%).</div>
      <div style="width:100%;overflow-x:auto"><canvas id="heatCV" style="display:block;width:100%;height:300px;background:#0a2415;border:1px solid var(--bd);border-radius:6px"></canvas></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;flex-wrap:wrap;gap:6px"><span style="font-size:10px;color:var(--mt);font-family:Rajdhani,sans-serif;font-weight:700">${nP} amostras de posição · ${nW} passes errados</span><span style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--mt)">Movimento:
        <span style="width:16px;height:8px;background:linear-gradient(90deg,#1a2a1a,#2a8f3a,#e6c200,#fff);border-radius:2px"></span>
        <span style="width:8px;height:8px;background:var(--dn);border-radius:50%"></span> passe errado
      </span></div></div>`;
    drawHeat($('heatCV'), mv, wp);
  }
  function drawHeat(cv, mv, wp) {
    const host = cv.parentElement;
    const cssW = host.clientWidth || 600, cssH = 300;
    const dpr = window.devicePixelRatio || 1;
    cv.width = cssW * dpr; cv.height = cssH * dpr; cv.style.height = cssH + 'px';
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    const m = 6;
    ctx.fillStyle = '#0d2a1a'; ctx.fillRect(0, 0, cssW, cssH);
    const cols = 10;
    for (let i = 0; i < cols; i++) { ctx.fillStyle = i % 2 ? '#103020' : '#0c2618'; ctx.fillRect(i * cssW / cols, 0, cssW / cols + 1, cssH); }
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(m, m, cssW - 2 * m, cssH - 2 * m);
    ctx.beginPath(); ctx.moveTo(cssW / 2, m); ctx.lineTo(cssW / 2, cssH - m); ctx.stroke();
    ctx.beginPath(); ctx.arc(cssW / 2, cssH / 2, Math.min(cssW, cssH) * 0.12, 0, Math.PI * 2); ctx.stroke();
    const pw = cssW * 0.15, ph = cssH * 0.5, gw = cssW * 0.05, gh = cssH * 0.3;
    ctx.strokeRect(m, cssH / 2 - ph / 2, pw, ph); ctx.strokeRect(m, cssH / 2 - gh / 2, gw, gh);
    ctx.strokeRect(cssW - m - pw, cssH / 2 - ph / 2, pw, ph); ctx.strokeRect(cssW - m - gw, cssH / 2 - gh / 2, gw, gh);
    if (!mv.length && !wp.length) {
      ctx.fillStyle = '#5a7090'; ctx.font = '11px Rajdhani, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Rode uma simulação ao vivo (Partida → Iniciar) para gerar o mapa de calor.', cssW / 2, cssH / 2);
      return;
    }
    if (mv.length) {
      ctx.globalCompositeOperation = 'lighter';
      const r = Math.max(14, cssW * 0.035);
      for (let i = 0; i < mv.length; i += 2) {
        const x = mv[i] * cssW, y = mv[i + 1] * cssH;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,150,40,0.16)');
        g.addColorStop(0.6, 'rgba(255,120,0,0.05)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (wp.length) {
      for (let i = 0; i < wp.length; i += 2) {
        const x = wp[i] * cssW, y = wp[i + 1] * cssH;
        ctx.fillStyle = 'rgba(255,82,82,0.85)'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,150,150,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1;
    ctx.strokeRect(m, m, cssW - 2 * m, cssH - 2 * m);
    ctx.beginPath(); ctx.moveTo(cssW / 2, m); ctx.lineTo(cssW / 2, cssH - m); ctx.stroke();
  }

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
  const _d = new Date(); _d.setDate(_d.getDate() + 1); _d.setHours(20, 0, 0, 0);
  const _p = n => String(n).padStart(2, '0');
  $('calDT').value = `${_d.getFullYear()}-${_p(_d.getMonth() + 1)}-${_p(_d.getDate())}T${_p(_d.getHours())}:${_p(_d.getMinutes())}`;

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(rafId);
    document.body.classList.remove('br-page');
    window.removeEventListener('resize', onResize);
  };
}