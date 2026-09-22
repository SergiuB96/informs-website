export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, product, consent } = req.body || {};

  /* Abonarea la noutăți cere consimțământ explicit, dat printr-o bifă
     separată de descărcare. Fără el nu ajunge nimic în Brevo. */
  if (consent !== true) {
    return res.status(400).json({ error: 'Lipsește acordul pentru noutăți' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalid' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          PRODUS: product || '',
          SURSA:  'Descărcare gratuită INFORMS',
        },
        updateEnabled: true,
      }),
    });

    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ ok: true });
    }

    const data = await response.json();
    // Contact already exists = success for us
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ ok: true });
    }

    return res.status(500).json({ error: 'Brevo error', detail: data });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
