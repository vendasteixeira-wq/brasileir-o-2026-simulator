import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { home, away, scoreH, scoreA, xgH, xgA, startISO } = body;
    if (!home || !away || !startISO) return Response.json({ error: 'Dados incompletos' }, { status: 400 });

    const start = new Date(startISO);
    if (isNaN(start.getTime())) return Response.json({ error: 'Data invalida' }, { status: 400 });
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2h de partida

    const winner = scoreH > scoreA ? home : scoreA > scoreH ? away : 'Empate';
    const summary = `⚽ ${home} ${scoreH}x${scoreA} ${away}`;
    const description = [
      `Simulacao Brasileirao 2026 - Simulador Opta`,
      `Mandante: ${home} | Visitante: ${away}`,
      `Placar: ${scoreH} x ${scoreA}`,
      `xG: ${xgH} - ${xgA}`,
      `Resultado: ${winner === 'Empate' ? 'Empate' : 'Vitoria ' + winner}`,
      ``,
      `Agendado por ${user.full_name || user.email}`
    ].join('\n');

    const conn = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const accessToken = conn && conn.accessToken;
    if (!accessToken) return Response.json({ error: 'Google Calendar nao conectado' }, { status: 500 });

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        reminders: { useDefault: true }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: 'Google API: ' + err }, { status: 502 });
    }
    const event = await res.json();
    return Response.json({ ok: true, htmlLink: event.htmlLink, id: event.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}