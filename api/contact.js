import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { nume, email, telefon, subiect, mesaj } = req.body || {};

  if (!nume || !email || !mesaj) {
    return res.status(400).json({ ok: false, error: 'Câmpuri obligatorii lipsă' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Website INFORMS <${process.env.SMTP_USER}>`,
      to: 'office@informs.ro',
      replyTo: email,
      subject: `Mesaj nou - ${subiect || 'Contact INFORMS'}`,
      text: `Nume: ${nume}\nEmail: ${email}\nTelefon: ${telefon || ''}\nSubiect: ${subiect || ''}\n\nMesaj:\n${mesaj}`,
    });

    /* Cererea de retragere trimisă prin formularul online se confirmă pe
       un suport durabil (art. 11^1 din OUG 34/2014). Textul e fix, fără
       nimic din mesajul vizitatorului în afară de numărul comenzii
       validat, ca endpointul să nu poată fi folosit pentru spam. */
    if (req.body.tip === 'retragere' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const comanda = String(req.body.comanda || '').trim();
      const nrComanda = /^[A-Za-z0-9._-]{1,64}$/.test(comanda) ? comanda : '(nespecificat)';
      const data = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
      await transporter.sendMail({
        from: `INFORMS <${process.env.SMTP_USER}>`,
        to: email,
        replyTo: 'office@informs.ro',
        subject: `Am primit cererea de retragere - comanda ${nrComanda}`,
        text:
          'Bună ziua,\n\n' +
          `Confirmăm primirea cererii de retragere pentru comanda ${nrComanda}, înregistrată la ${data}.\n\n` +
          'Vă comunicăm soluția în cel mult 14 zile. Dacă nu ați trimis dumneavoastră această cerere, ' +
          'scrieți-ne la office@informs.ro.\n\n' +
          'MILBAC MANAGEMENT S.R.L. (INFORMS)\nwww.informs.ro',
      }).catch(err => {
        /* Cererea a ajuns deja la office; o confirmare eșuată nu trebuie
           să-l facă pe vizitator să retrimită. */
        console.error('withdrawal confirmation failed', { nrComanda, message: err.message });
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error', detail: err.message });
  }
}
