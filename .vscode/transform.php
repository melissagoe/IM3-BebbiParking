<?php

$data = include ("extract.php");

// Annahme: extract.php gibt ein Array wie im Beispiel zurück
// Also z. B.: $data = [ "total_count" => ..., "results" => [ ... ] ];

$results = $data['results'] ?? [];

// 2. Datenbankverbindung
$host = 'on89yu.ftp.infomaniak.com';
$dbname = 'on89yu_bebbiparking';
$user = 'on89yu_bebbiparking';
$pass = 'ParkingBebbi2025$';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb3", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Datenbankverbindung fehlgeschlagen: " . $e->getMessage());
}

// 3. SQL-Statement vorbereiten
$sql = "INSERT INTO BebbiParking_Daten (id, free, total, auslastung, status, address)
        VALUES (:id, :free, :total, :auslastung, :status, :address)
        ON DUPLICATE KEY UPDATE
            free = VALUES(free),
            total = VALUES(total),
            auslastung = VALUES(auslastung),
            status = VALUES(status),
            address = VALUES(address),
            timestamp = CURRENT_TIMESTAMP";

$stmt = $pdo->prepare($sql);

// 4. Durch jedes Parkhaus iterieren
foreach ($results as $index => $parkhaus) {

    // Werte bereinigen / prüfen
    $id = $index + 1; // oder eine eindeutige ID, falls du keine Auto-ID nutzt
    $free = isset($parkhaus['free']) ? (int)$parkhaus['free'] : 0;
    $total = isset($parkhaus['total']) && $parkhaus['total'] !== '' ? (int)$parkhaus['total'] : 0;

    // Auslastung berechnen, falls fehlt
    if (!isset($parkhaus['auslastung_prozent']) || $parkhaus['auslastung_prozent'] === '') {
        if ($total > 0) {
            $auslastung = round((($total - $free) / $total) * 100);
        } else {
            $auslastung = 0;
        }
    } else {
        $auslastung = (int)$parkhaus['auslastung_prozent'];
    }

    $status = $parkhaus['status'] ?? 'offen';
    $address = $parkhaus['address'] ?? null;

    // 5. In DB schreiben
    $stmt->execute([
        ':id' => $id,
        ':free' => $free,
        ':total' => $total,
        ':auslastung' => $auslastung,
        ':status' => $status,
        ':address' => $address
    ]);
}

echo "Transformation abgeschlossen und Daten geladen.";
?>