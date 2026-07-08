export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { nume, email, telefon, subiect, mesaj } = req.body || {};

  if (!nume || !email || !mesaj) {
    return res.status(400).json({ ok: false, error: 'Câmpuri obligatorii lipsă' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website INFORMS <office@informs.ro>',
        to: ['office@informs.ro'],
        reply_to: email,
        subject: `Mesaj nou — ${subiect || 'Contact INFORMS'}`,
        text: `Nume: ${nume}\nEmail: ${email}\nTelefon: ${telefon || ''}\nSubiect: ${subiect || ''}\n\nMesaj:\n${mesaj}`,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ ok: true });
    }

    const data = await response.json().catch(() => ({}));
    return res.status(500).json({ ok: false, error: 'Resend error', detail: data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
