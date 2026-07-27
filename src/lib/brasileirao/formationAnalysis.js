// Análise de eficácia por esquema tático: para cada time, monta o melhor XI automaticamente
// em cada formação, calcula química (CH.calc) e OVR ajustado (CH.ovr) = "eficácia".
// Mostra o ranking do esquema selecionado e qual formação é mais eficaz por time/treinador.
import { B20, FMS, PL, gtp, pco, CH, rc, pc } from './engine';
import { getCoaches, fetchCoaches } from './coachPanel';

const FORMS = Object.keys(FMS);

// Monta o melhor XI de um time para uma formação (mesma lógica do Sim.init / Auto Preencher)
function buildSquad(team, formation) {
  const pool = gtp(team);
  const slots = FMS[formation].ps;
  const used = new Set();
  const sq = new Array(slots.length).fill(null);
  slots.forEach((s, i) => {
    let best = null, bs = -1;
    for (let k = 0; k < pool.length; k++) {
      if (used.has(k)) continue;
      const c = pco(s, pool[k]);
      const sc = c * 100 + pool[k].ovr;
      if (c > 0 && sc > bs) { bs = sc; best = k; }
    }
    if (best !== null) { used.add(best); sq[i] = pool[best]; }
    else if (pool.length) sq[i] = pool[i % pool.length];
  });
  return sq;
}

function teamEfficacy(team, formation) {
  const sq = buildSquad(team, formation);
  const chem = CH.calc(sq, formation);
  const ovr = CH.ovr(sq, chem);
  return { team, formation, chem, ovr, eff: ovr, sq };
}

function bestPlayer(sq) {
  const valid = sq.filter(Boolean);
  if (!valid.length) return null;
  return [...valid].sort((a, b) => b.ovr - a.ovr)[0];
}

// Eficácia de um jogador para a formação (maior compatibilidade entre os slots)
export function playerFit(player, formation) {
  if (!formation || !FMS[formation]) return 1;
  let best = 0;
  FMS[formation].ps.forEach(s => { best = Math.max(best, pco(s, player)); });
  return best;
}

function effColor(e) {
  return e >= 80 ? 'var(--gd)' : e >= 74 ? 'var(--sv)' : e >= 68 ? 'var(--br)' : 'var(--dn)';
}

export function renderFormationAnalysis(container, formation) {
  if (!container) return;
  if (!formation) { container.innerHTML = ''; return; }
  const coaches = getCoaches();
  const coachOf = {};
  if (coaches) coaches.forEach(c => { coachOf[c.club] = c; });

  // Ranking do esquema selecionado
  const rows = B20.map(t => {
    const e = teamEfficacy(t, formation);
    const bp = bestPlayer(e.sq);
    const coach = coachOf[t];
    return { ...e, coach: coach ? coach.name : '—', baseForm: coach ? coach.formation : '—', bp };
  }).sort((a, b) => b.eff - a.eff);

  // Melhor formação por time (eficácia em todas as 4 formações)
  const perTeam = B20.map(t => {
    const byForm = {};
    FORMS.forEach(f => { byForm[f] = teamEfficacy(t, f).eff; });
    const best = FORMS.reduce((a, b) => byForm[b] > byForm[a] ? b : a);
    const coach = coachOf[t];
    return { team: t, byForm, best, coach: coach ? coach.name : '—', baseForm: coach ? coach.formation : '—', match: coach ? coach.formation === best : false };
  });

  const maxEff = Math.max(...rows.map(r => r.eff)) || 1;

  const rankRows = rows.map((r, i) => {
    const bp = r.bp;
    const bpFit = bp ? playerFit(bp, formation) : 0;
    return `<tr>
      <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:var(--mt)">${i + 1}</td>
      <td style="font-size:10px">${r.team}</td>
      <td style="font-size:9px;color:var(--mt)">${r.coach}</td>
      <td style="font-size:9px;color:var(--ac2);text-align:center;font-family:Rajdhani,sans-serif;font-weight:700">${r.baseForm}</td>
      <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:${effColor(r.chem)}">${r.chem}</td>
      <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:${rc(r.ovr)}">${r.ovr}</td>
      <td style="text-align:center">
        <div style="display:flex;align-items:center;gap:4px;justify-content:center">
          <div style="width:54px;height:7px;background:var(--bd);border-radius:3px;overflow:hidden"><div style="height:100%;width:${(r.eff / maxEff * 100)}%;background:${effColor(r.eff)}"></div></div>
          <span style="font-family:Rajdhani,sans-serif;font-weight:700;color:${effColor(r.eff)};width:24px">${r.eff}</span>
        </div>
      </td>
      <td style="font-size:9px;color:var(--mt);text-align:center">${bp ? `${bp.name} <span style="color:${rc(bp.ovr)}">${bp.ovr}</span>${bpFit >= 1 ? ' <i class="fas fa-check" style="color:var(--ac)"></i>' : ''}` : '—'}</td>
    </tr>`;
  }).join('');

  const formCols = FORMS.map(f => `<th style="text-align:center;font-size:9px">${f}</th>`).join('');
  const perTeamRows = perTeam.map(t => {
    const cells = FORMS.map(f => {
      const v = t.byForm[f];
      const isBest = f === t.best;
      return `<td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:${isBest ? effColor(v) : 'var(--mt)'};${isBest ? 'background:rgba(0,230,118,.08)' : ''}">${v}${isBest ? ' ★' : ''}</td>`;
    }).join('');
    return `<tr>
      <td style="font-size:10px">${t.team}</td>
      <td style="font-size:9px;color:var(--mt)">${t.coach}</td>
      <td style="font-size:9px;color:var(--ac2);text-align:center;font-family:Rajdhani,sans-serif;font-weight:700">${t.baseForm}</td>
      <td style="text-align:center;font-family:Rajdhani,sans-serif;font-weight:700;color:var(--ac)">${t.best}</td>
      <td style="text-align:center">${t.coach !== '—' ? (t.match ? '<i class="fas fa-check" style="color:var(--ac)" title="formação base = mais eficaz"></i>' : '<i class="fas fa-exchange-alt" style="color:var(--ac2)" title="formação base diferente da mais eficaz"></i>') : '—'}</td>
      ${cells}
    </tr>`;
  }).join('');

  // Contagem de quantos técnicos usam a formação mais eficaz
  const withCoaches = perTeam.filter(t => t.coach !== '—');
  const aligned = withCoaches.filter(t => t.match).length;

  container.innerHTML = `
    <div class="pnl" style="padding:8px;margin-top:8px">
      <div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-chess"></i> Eficácia por Esquema Tático — ${formation}</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Monta o melhor XI de cada time no esquema <b>${formation}</b> (compatibilidade de posição + OVR), calcula a <b>química</b> (clube/liga/nacionalidade + encaixe) e o <b>OVR ajustado</b> = eficácia. Ordenado do mais ao menos eficaz. ${coaches ? '' : '<span style="color:var(--ac2)">Carregue os técnicos para ver nomes e formações base.</span>'}</div>
      ${!coaches ? `<button id="bLoadCoach" style="padding:6px 14px;background:rgba(99,102,241,.12);border:1px solid #6366f1;color:#818cf8;border-radius:6px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:12px;margin-bottom:6px"><i class="fas fa-satellite-dish"></i> Carregar Técnicos (online)</button>` : ''}
      <div style="overflow-x:auto"><table class="gt2" style="width:100%"><tr><th>#</th><th style="text-align:left">Time</th><th>Treinador</th><th>Form. base</th><th>Quím.</th><th>OVR</th><th>Eficácia</th><th>Melhor jogador</th></tr>${rankRows}</table></div>
    </div>
    <div class="pnl" style="padding:8px;margin-top:6px">
      <div class="pt" style="border:none;margin:0 0 6px"><i class="fas fa-trophy" style="color:var(--ac2)"></i> Qual formação é mais eficaz por time/treinador</div>
      <div style="font-size:10px;color:var(--mt);line-height:1.5;margin-bottom:6px"><i class="fas fa-info-circle" style="color:var(--ob)"></i> Compara a eficácia de cada time nas 4 formações disponíveis. ★ = formação mais eficaz. ${coaches ? `<b style="color:var(--ac)">${aligned}/${withCoaches.length}</b> técnicos já usam sua formação mais eficaz; os demais poderiam ganhar eficácia trocando de esquema.` : ''}</div>
      <div style="overflow-x:auto"><table class="gt2" style="width:100%"><tr><th style="text-align:left">Time</th><th>Treinador</th><th>Usa</th><th>Melhor</th><th>Alinhado?</th>${formCols}</tr>${perTeamRows}</table></div>
      <div style="font-size:9px;color:var(--mt);margin-top:5px;line-height:1.4"><i class="fas fa-info-circle"></i> ★ = formação de maior eficácia para o elenco atual · <i class="fas fa-check" style="color:var(--ac)"></i> treinador já usa sua melhor formação · <i class="fas fa-exchange-alt" style="color:var(--ac2)"></i> há uma formação mais eficaz que a atual.</div>
    </div>`;

  const btn = container.querySelector('#bLoadCoach');
  if (btn) btn.addEventListener('click', async () => {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...'; btn.disabled = true;
    try {
      await fetchCoaches();
      renderFormationAnalysis(container, formation);
    } catch (e) {
      btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Falha — tente novamente';
      btn.disabled = false;
    }
  });
}