// Transmissão online do jogo selecionado — busca onde assistir (TV/streaming) via IA web search
// e embute o vídeo quando uma URL pública está disponível.
import { base44 } from '@/api/base44Client';

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function fetchStream(home, away) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Você é um guia de transmissões esportivas do Brasileirão Série A 2026. Para a partida ${home} (mandante) vs ${away} (visitante), descubra em JSON: { "channel": nome do canal de TV que transmite (ex: Globo, SporTV, Premiere, Record, SBT), "streaming": plataforma de streaming oficial (ex: Globo Play, Globoplay, Premiere, Star+, Disney+, Amazon Prime Video, YouTube), "streamUrl": URL pública e embeddable do vídeo/transmissão se existir (YouTube embed url https://www.youtube.com/embed/VIDEO_ID ou null), "kickoff": horário de início (ex: "21:00 qua 30/07"), "status": "ao vivo" | "agendado" | "encerrado" | "replay", "competition": competição (ex: Brasileirão Série A 2026 - Rodada X), "venue": estádio, "highlightsUrl": URL de YouTube com melhores momentos/highlights se existir (embed url) ou null, "note": nota curta sobre a transmissão (ex: "Jogo exclusivo no Premiere" ou "Transmissão aberta na Globo") }. Use dados reais e atuais da internet.`,
    add_context_from_internet: true,
    response_json_schema: {
      type: 'object',
      properties: {
        channel: { type: 'string' },
        streaming: { type: 'string' },
        streamUrl: { type: 'string' },
        kickoff: { type: 'string' },
        status: { type: 'string' },
        competition: { type: 'string' },
        venue: { type: 'string' },
        highlightsUrl: { type: 'string' },
        note: { type: 'string' }
      }
    }
  });
  return typeof res === 'string' ? JSON.parse(res) : res;
}

export function renderStream(container, getHome, getAway) {
  if (!container) return;
  container.innerHTML = `
    <button id="bStream" style="width:100%;padding:5px;background:rgba(255,82,82,.12);border:1px solid var(--dn);color:#ff6b6b;border-radius:5px;cursor:pointer;font-family:Rajdhani,sans-serif;font-weight:700;font-size:11px;margin-bottom:4px"><i class="fas fa-tv"></i> Buscar Transmissão Online</button>
    <div id="strOut"></div>`;
  container.querySelector('#bStream').addEventListener('click', async () => {
    const btn = container.querySelector('#bStream');
    const out = container.querySelector('#strOut');
    const home = typeof getHome === 'function' ? getHome() : getHome;
    const away = typeof getAway === 'function' ? getAway() : getAway;
    if (home === away) { out.innerHTML = '<div style="color:var(--mt);font-size:11px;padding:4px">Selecione times diferentes.</div>'; return; }
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...'; btn.disabled = true;
    out.innerHTML = '<div class="ild"><i class="fas fa-spinner fa-spin"></i> Buscando transmissão, canal e streaming...</div>';
    try {
      const d = await fetchStream(home, away);
      const statusMap = {
        'ao vivo': { label: 'AO VIVO', col: 'var(--dn)', icon: 'fa-circle' },
        'agendado': { label: 'AGENDADO', col: 'var(--ob)', icon: 'fa-clock' },
        'encerrado': { label: 'ENCERRADO', col: 'var(--mt)', icon: 'fa-flag-checkered' },
        'replay': { label: 'REPLAY', col: 'var(--ac2)', icon: 'fa-redo' }
      };
      const st = statusMap[norm(d.status)] || statusMap['agendado'];
      // Lazy-load: só carrega o iframe pesado quando o usuário clica em play.
      // Antes disso, mostra apenas a thumbnail (imagem leve) — não exige nada do app.
      const ytId = (u) => {
        if (!u) return null;
        const m = String(u).match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/);
        return m ? m[1] : null;
      };
      const vid = ytId(d.streamUrl) || ytId(d.highlightsUrl);
      const embedUrl = d.streamUrl || d.highlightsUrl;
      let videoHTML = '';
      if (embedUrl) {
        const thumb = vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '';
        const wrap = `strVid-${Math.random().toString(36).slice(2, 8)}`;
        videoHTML = `<div id="${wrap}" style="position:relative;width:100%;padding-top:56.25%;background:#000;border-radius:6px;overflow:hidden;margin-bottom:6px;cursor:pointer" data-embed="${embedUrl}">
          ${thumb ? `<img src="${thumb}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:.8" alt="thumb" loading="lazy">` : '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--mt);font-size:11px">Vídeo disponível</div>'}
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(255,0,0,.85);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,.4)"><i class="fas fa-play"></i></div>
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));color:#fff;font-size:9px;padding:4px 6px;font-family:Rajdhani,sans-serif;font-weight:700">${d.streamUrl ? 'Assistir transmissão' : 'Melhores momentos'} · clique para carregar</div>
        </div>`;
        // listener injetado depois do innerHTML
        setTimeout(() => {
          const node = out.querySelector('#' + wrap);
          if (node) node.addEventListener('click', () => {
            node.innerHTML = `<iframe src="${node.dataset.embed}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
            node.style.cursor = 'default';
          });
        }, 0);
      } else {
        videoHTML = `<div style="background:var(--cd2);border:1px dashed var(--bd);border-radius:6px;padding:14px;text-align:center;margin-bottom:6px">
          <i class="fas fa-video-slash" style="color:var(--mt);font-size:20px;margin-bottom:6px"></i>
          <div style="font-size:11px;color:var(--mt);line-height:1.5">Sem vídeo público embedável para esta transmissão.<br>Assista na plataforma oficial abaixo.</div>
        </div>`;
      }
      const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(home + ' x ' + away + ' brasileirao 2026 melhores momentos')}`;
      out.innerHTML = `
        <div style="background:var(--cd2);border-radius:6px;padding:6px;margin-bottom:6px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px">
            <span style="font-family:Rajdhani,sans-serif;font-weight:700;color:var(--tx);font-size:12px"><i class="fas fa-futbol" style="color:var(--ac)"></i> ${home} x ${away}</span>
            <span style="display:inline-flex;align-items:center;gap:4px;background:${st.col};color:#0b1016;font-family:Rajdhani,sans-serif;font-weight:700;font-size:9px;padding:2px 7px;border-radius:10px"><i class="fas ${st.icon}"></i> ${st.label}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:9px;color:var(--mt);margin-bottom:4px">
            <div><i class="fas fa-tv" style="color:var(--ob)"></i> <b style="color:var(--tx)">${d.channel || '-'}</b></div>
            <div><i class="fas fa-wifi" style="color:var(--ac2)"></i> <b style="color:var(--tx)">${d.streaming || '-'}</b></div>
            <div><i class="fas fa-clock" style="color:var(--ob)"></i> ${d.kickoff || '-'}</div>
            <div><i class="fas fa-map-marker-alt" style="color:var(--ac)"></i> ${d.venue || '-'}</div>
          </div>
          <div style="font-size:9px;color:var(--mt)"><i class="fas fa-trophy" style="color:var(--ac2)"></i> ${d.competition || '-'}</div>
          ${d.note ? `<div style="font-size:9px;color:var(--ob);margin-top:3px;border-top:1px solid var(--bd);padding-top:3px"><i class="fas fa-info-circle"></i> ${d.note}</div>` : ''}
        </div>
        ${videoHTML}
        <a href="${ytSearch}" target="_blank" style="display:block;text-align:center;padding:5px;background:rgba(255,0,0,.1);border:1px solid #ff4d4d;color:#ff6b6b;border-radius:5px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:10px;text-decoration:none;margin-bottom:4px"><i class="fab fa-youtube"></i> Ver no YouTube</a>`;
    } catch (e) {
      out.innerHTML = `<div style="color:var(--dn);font-size:11px;padding:4px">Falha: ${e.message}</div>`;
    } finally {
      btn.innerHTML = orig; btn.disabled = false;
    }
  });
}