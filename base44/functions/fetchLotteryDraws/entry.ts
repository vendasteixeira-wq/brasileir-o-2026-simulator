import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SLUG = { mega: 'megasena', quina: 'quina', lotofacil: 'lotofacil' };

// Busca um concurso (ou o ultimo se contest=null) na API publica espelhada da Caixa
async function fetchDraw(slug, contest) {
  const url = contest == null
    ? `https://servicebus2.caixa.gov.br/portaldeloterias/api/${slug}`
    : `https://servicebus2.caixa.gov.br/portaldeloterias/api/${slug}/${contest}`;
  const r = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) return null;
  const j = await r.json().catch(() => null);
  if (!j) return null;
  const nums = j.listaDezenas || j.dezenas || j.dezenasSorteadas || [];
  const numbers = nums.map(x => parseInt(String(x), 10)).filter(n => Number.isFinite(n));
  const drawNo = j.numero != null ? j.numero : j.concurso;
  const date = j.dataApuracao || j.data || '';
  return { draw_no: drawNo, date, numbers };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const mod = body.modality;
    const count = Math.min(Math.max(parseInt(body.count, 10) || 60, 1), 120);
    const stride = Math.max(1, parseInt(body.stride, 10) || 1);
    const slug = SLUG[mod];
    if (!slug) return Response.json({ error: 'modalidade invalida' }, { status: 400 });

    const latest = await fetchDraw(slug, null);
    if (!latest || !latest.draw_no) {
      return Response.json({ error: 'falha ao buscar ultimo concurso' }, { status: 502 });
    }

    const concursos = [];
    const base = latest.draw_no;
    for (let i = 1; i < count; i++) {
      const c = base - i * stride;
      if (c < 1) break;
      concursos.push(c);
    }

    const draws = [latest];
    const CONC = 8;
    for (let i = 0; i < concursos.length; i += CONC) {
      const batch = concursos.slice(i, i + CONC);
      const res = await Promise.all(batch.map(c => fetchDraw(slug, c).catch(() => null)));
      res.forEach(d => { if (d && d.numbers.length) draws.push(d); });
    }
    draws.sort((a, b) => b.draw_no - a.draw_no);
    return Response.json({ modality: mod, latest: base, count: draws.length, draws });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}