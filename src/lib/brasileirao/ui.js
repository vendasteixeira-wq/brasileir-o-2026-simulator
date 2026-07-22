import { PL, LG, COMP, FMS, pc, pco, rc, gto, gppda, Sim, CH, TPred } from './engine';

export function initBrasileirao(root) {
  document.body.classList.add('br-page');

  let SIM = null;
  let USQ = new Array(11).fill(null);
  let CF = '4-3-3';
  let SS = -1;
  let lt = 0;
  const speeds = [1, 2, 4, 8];
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

  // --- Match controls ---
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

  // --- Init ---
  popTS();
  popCS();
  popLF();

  // --- Cleanup ---
  return () => {
    cancelAnimationFrame(rafId);
    document.body.classList.remove('br-page');
    window.removeEventListener('resize', rsCV);
  };
}