<?php
// transform.php

// 1. Daten aus extract.php holen
$data = include('extract.php'); // erwartet ein Array $data mit ['results' => [...]]

$results = $data['results'] ?? [];

// 2. Neues Array für transformierte Daten
$transformed = [];

foreach ($results as $index => $parkhaus) {


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
    $title = $parkhaus['title'] ?? "Parkhaus $index";

    // Neues Array für DB-Insert
    $transformed[] = [
        'free' => $free,
        'total' => $total,
        'auslastung' => $auslastung,
        'status' => $status,
        'address' => $address,
        'title' => $title,
    ];
}

// 3. Als JSON zurückgeben (wird von load.php gelesen)
return json_encode($transformed, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
