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
      subject: `Mesaj nou — ${subiect || 'Contact INFORMS'}`,
      text: `Nume: ${nume}\nEmail: ${email}\nTelefon: ${telefon || ''}\nSubiect: ${subiect || ''}\n\nMesaj:\n${mesaj}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error', detail: err.message });
  }
}
