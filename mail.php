<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// ↓ Pune ACELAȘI email pe care îl ai în cPanel (la ambele)
$to   = 'office@informs.ro';
$from = 'office@informs.ro';

$subject = '=?UTF-8?B?' . base64_encode('Mesaj nou - ' . ($data['subiect'] ?? 'Contact INFORMS')) . '?=';

$body = "Nume: "    . ($data['nume']    ?? '') . "\n"
      . "Email: "   . ($data['email']   ?? '') . "\n"
      . "Telefon: " . ($data['telefon'] ?? '') . "\n"
      . "Subiect: " . ($data['subiect'] ?? '') . "\n\n"
      . "Mesaj:\n"  . ($data['mesaj']   ?? '');

$headers = "From: INFORMS <{$from}>\r\n"
         . "Reply-To: " . ($data['email'] ?? $from) . "\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "Content-Transfer-Encoding: 8bit";

$ok = mail($to, $subject, $body, $headers);

// Returnează și eroarea PHP dacă mail() a eșuat
echo json_encode([
    'ok'    => $ok,
    'error' => $ok ? null : error_get_last()['message'] ?? 'mail() returned false',
]);
