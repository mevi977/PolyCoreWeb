// Vercel Serverless Function: POST /api/partner-kontakt
// Schickt eine Telegram-Nachricht, sobald jemand auf "Kontakt anzeigen" klickt.
//
// Einrichtung (5 Minuten):
//  1. In Telegram @BotFather öffnen → /newbot → Namen vergeben → Token kopieren (z. B. 123456:ABC-DEF...)
//  2. Dem neuen Bot eine beliebige Nachricht schreiben (z. B. "hi")
//  3. Im Browser öffnen: https://api.telegram.org/bot<TOKEN>/getUpdates → "chat":{"id":123456789} → das ist die CHAT_ID
//  4. In Vercel → Project → Settings → Environment Variables:
//       TELEGRAM_BOT_TOKEN = <TOKEN>
//       TELEGRAM_CHAT_ID   = <CHAT_ID>
//  5. Deploy. Fertig.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const { partner = '?', page = '', time = '', ua = '' } = req.body || {};
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '';
  const when = new Date(time || Date.now()).toLocaleString('de-CH', { timeZone: 'Europe/Zurich' });

  const text =
    `🔔 *Partner-Kontakt angezeigt*\n\n` +
    `*Partner:* ${md(partner)}\n` +
    `*Zeit:* ${md(when)}\n` +
    `*Seite:* ${md(page)}\n` +
    `*IP:* ${md(ip)}\n` +
    `*Browser:* ${md(ua.slice(0, 120))}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown', disable_web_page_preview: true })
    });
    if (!r.ok) throw new Error(await r.text());
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ ok: false }); // Kontakt wird im Frontend trotzdem angezeigt
  }
}

function md(s) { return String(s).replace(/([_*`\[])/g, '\\$1'); }
