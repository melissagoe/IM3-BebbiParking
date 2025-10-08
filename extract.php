<?php

function fetchParkingData() {

$url = "https://data.bs.ch/api/explore/v2.1/catalog/datasets/100088/records?select=title%2C%20published%2C%20free%2C%20total%2C%20auslastung_prozent%2C%20name%2C%20id2%2C%20id%2C%20status%2C%20address&limit=20";
   // Initialisiert eine cURL-Sitzung
   $ch = curl_init($url);

   // Setzt Optionen
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

   // Führt die cURL-Sitzung aus und erhält den Inhalt
   $response = curl_exec($ch);

   // Schließt die cURL-Sitzung
   curl_close($ch);

   return json_decode($response, true);

   // Dekodiert die JSON-Antwort und gibt Daten zurück 
   return json_decode($response, true);
}
 echo "pre>";
 print_r (fetchParkingData());
echo "</pre>";

// Gibt die Daten zurück, wenn dieses Skript eingebunden ist
return fetchParkingData();
?>