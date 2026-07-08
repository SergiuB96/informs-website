export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { nume, email, telefon, subiect, mesaj } = req.body || {};

  if (!nume || !email || !mesaj) {
    return res.status(400).json({ ok: false, error: 'Câmpuri obligatorii lipsă' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Website INFORMS', email: 'office@informs.ro' },
        to: [{ email: 'office@informs.ro' }],
        replyTo: { email },
        subject: `Mesaj nou — ${subiect || 'Contact INFORMS'}`,
        textContent: `Nume: ${nume}\nEmail: ${email}\nTelefon: ${telefon || ''}\nSubiect: ${subiect || ''}\n\nMesaj:\n${mesaj}`,
      }),
    });

    if (response.status === 201) {
      return res.status(200).json({ ok: true });
    }

    const data = await response.json().catch(() => ({}));
    return res.status(500).json({ ok: false, error: 'Brevo error', detail: data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
