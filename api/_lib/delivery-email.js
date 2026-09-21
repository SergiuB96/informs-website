/* Emailul de livrare trimis după confirmarea plății.
 *
 * Conține confirmarea cerută de OUG 34/2014 art. 8 alin. (7) pentru
 * conținut digital: acordul expres pentru livrarea imediată și luarea la
 * cunoștință a pierderii dreptului de retragere (art. 16 lit. m). Fără ea,
 * art. 14 alin. (6) lit. b) scutește clientul de plată. Formularea reia
 * căsuța bifată în formularul de plată (Shop.jsx). */

/* Oglindă a COMPANY / COMMERCE din Config.jsx; serverul nu îl poate importa. */
const COMPANY = {
  name: 'MILBAC MANAGEMENT S.R.L.',
  cui: '44991231',
  regCom: 'J26/1603/2021',
  address: 'Bld. Pandurilor nr. 86, et. 3, ap. 11, Târgu Mureș, jud. Mureș',
  email: 'office@informs.ro',
  site: 'www.informs.ro',
};
const WITHDRAWAL_DAYS = 14;
const INVOICE_MAX_HOURS = 24;

const COLORS = { navy: '#0C0032', blue: '#065AF7', ink: '#212121', muted: '#5B5B6B', line: '#E6E6EE', bg: '#F4F5F9' };

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date).replace(',', ', ora');
}

function fullName(firstName, lastName) {
  return [firstName, lastName].map(s => String(s || '').trim()).filter(Boolean).join(' ');
}

function buildFields({ product, orderID, link, firstName, lastName, paidAt, expiresAt, siteUrl }) {
  const name = fullName(firstName, lastName);
  return {
    greeting: name ? 'Bună ziua, ' + name + ',' : 'Bună ziua,',
    title: product.title,
    price: product.price + ' RON',
    paidAt: formatDateTime(paidAt),
    expiresAt: formatDateTime(expiresAt),
    orderID,
    link,
    termsUrl: siteUrl + '/termeni-si-conditii',
    withdrawal:
      'La plasarea comenzii ați solicitat expres livrarea imediată a documentului digital și ați ' +
      'confirmat că ați luat cunoștință că, odată începută descărcarea, vă pierdeți dreptul de ' +
      'retragere de ' + WITHDRAWAL_DAYS + ' zile (art. 16 lit. m din OUG nr. 34/2014).',
  };
}

function buildText(f) {
  return [
    f.greeting,
    '',
    'Vă mulțumim pentru comandă. Plata a fost confirmată, iar documentul este gata de descărcare.',
    '',
    f.title,
    'Descărcați documentul de aici:',
    f.link,
    '',
    'Linkul este personal și rămâne activ până pe ' + f.expiresAt + '.',
    'Vă recomandăm să salvați fișierul imediat după descărcare.',
    '',
    'DETALII COMANDĂ',
    'Produs: ' + f.title,
    'Total plătit: ' + f.price + ' (societate neplătitoare de TVA)',
    'Data: ' + f.paidAt,
    'Referință comandă: ' + f.orderID,
    '',
    'Factura fiscală vă va fi trimisă într-un email separat, în cel mult ' + INVOICE_MAX_HOURS + ' de ore.',
    '',
    'CONFIRMAREA ACORDULUI DUMNEAVOASTRĂ',
    f.withdrawal,
    'Termeni și condiții: ' + f.termsUrl,
    '',
    'AVEȚI NEVOIE DE AJUTOR?',
    'Dacă linkul nu funcționează sau a expirat, răspundeți la acest email și vă trimitem unul nou, fără costuri.',
    '',
    'Cu stimă,',
    'Echipa INFORMS',
    '',
    COMPANY.name + ' | CUI ' + COMPANY.cui + ' | ' + COMPANY.regCom,
    COMPANY.address,
    COMPANY.email + ' | ' + COMPANY.site,
  ].join('\n');
}

function row(label, value) {
  return '<tr>' +
    '<td style="padding:6px 0;color:' + COLORS.muted + ';font-size:14px;width:150px;vertical-align:top;">' + escapeHtml(label) + '</td>' +
    '<td style="padding:6px 0;color:' + COLORS.ink + ';font-size:14px;vertical-align:top;">' + escapeHtml(value) + '</td>' +
    '</tr>';
}

function heading(text) {
  return '<p style="margin:28px 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;color:' + COLORS.muted + ';">' +
    escapeHtml(text) + '</p>';
}

function buildHtml(f) {
  const p = 'margin:0 0 14px;font-size:15px;line-height:1.6;color:' + COLORS.ink + ';';
  const small = 'margin:0 0 10px;font-size:13px;line-height:1.6;color:' + COLORS.muted + ';';
  const link = 'color:' + COLORS.blue + ';';

  return '<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentul dumneavoastră INFORMS</title></head>' +
    '<body style="margin:0;padding:0;background:' + COLORS.bg + ';font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + COLORS.bg + ';">' +
    '<tr><td align="center" style="padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid ' + COLORS.line + ';border-radius:8px;">' +

    '<tr><td style="padding:22px 32px;background:' + COLORS.navy + ';border-radius:8px 8px 0 0;">' +
    '<span style="font-size:20px;font-weight:700;letter-spacing:.06em;color:#FFFFFF;">INFORMS</span></td></tr>' +

    '<tr><td style="padding:32px;">' +
    '<p style="' + p + '">' + escapeHtml(f.greeting) + '</p>' +
    '<p style="' + p + '">Vă mulțumim pentru comandă. Plata a fost confirmată, iar documentul este gata de descărcare.</p>' +

    '<p style="margin:24px 0 16px;font-size:17px;font-weight:700;color:' + COLORS.ink + ';">' + escapeHtml(f.title) + '</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="border-radius:6px;background:' + COLORS.blue + ';">' +
    '<a href="' + escapeHtml(f.link) + '" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:6px;">Descărcați documentul</a>' +
    '</td></tr></table>' +
    '<p style="' + small + 'margin-top:16px;">Linkul este personal și rămâne activ până pe <strong>' + escapeHtml(f.expiresAt) + '</strong>. ' +
    'Vă recomandăm să salvați fișierul imediat după descărcare.</p>' +
    '<p style="' + small + '">Dacă butonul nu funcționează, copiați acest link în browser:<br>' +
    '<a href="' + escapeHtml(f.link) + '" style="' + link + 'word-break:break-all;">' + escapeHtml(f.link) + '</a></p>' +

    heading('DETALII COMANDĂ') +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ' + COLORS.line + ';">' +
    row('Produs', f.title) +
    row('Total plătit', f.price + ' (societate neplătitoare de TVA)') +
    row('Data', f.paidAt) +
    row('Referință comandă', f.orderID) +
    '</table>' +
    '<p style="' + small + 'margin-top:12px;">Factura fiscală vă va fi trimisă într-un email separat, în cel mult ' + INVOICE_MAX_HOURS + ' de ore.</p>' +

    heading('CONFIRMAREA ACORDULUI DUMNEAVOASTRĂ') +
    '<p style="' + small + '">' + escapeHtml(f.withdrawal) + '</p>' +
    '<p style="' + small + '"><a href="' + escapeHtml(f.termsUrl) + '" style="' + link + '">Termeni și condiții</a></p>' +

    heading('AVEȚI NEVOIE DE AJUTOR?') +
    '<p style="' + small + '">Dacă linkul nu funcționează sau a expirat, răspundeți la acest email și vă trimitem unul nou, fără costuri.</p>' +

    '<p style="' + p + 'margin-top:28px;">Cu stimă,<br>Echipa INFORMS</p>' +
    '</td></tr>' +

    '<tr><td style="padding:20px 32px;border-top:1px solid ' + COLORS.line + ';font-size:12px;line-height:1.6;color:' + COLORS.muted + ';">' +
    escapeHtml(COMPANY.name) + ' | CUI ' + escapeHtml(COMPANY.cui) + ' | ' + escapeHtml(COMPANY.regCom) + '<br>' +
    escapeHtml(COMPANY.address) + '<br>' +
    '<a href="mailto:' + COMPANY.email + '" style="' + link + '">' + COMPANY.email + '</a> | ' +
    '<a href="https://' + COMPANY.site + '" style="' + link + '">' + COMPANY.site + '</a>' +
    '</td></tr>' +

    '</table></td></tr></table></body></html>';
}

function buildDeliveryEmail(input) {
  const fields = buildFields(input);
  return {
    subject: 'Documentul dumneavoastră INFORMS este gata de descărcare',
    text: buildText(fields),
    html: buildHtml(fields),
  };
}

module.exports = { buildDeliveryEmail, escapeHtml };
