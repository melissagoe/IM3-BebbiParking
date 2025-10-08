<?php
require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');



try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $sql = "SELECT * FROM `BebbiParking_Daten`";

   $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $results = $stmt->fetchAll();

    echo json_encode($results);

} catch (PDOException $e) {
   echo json_encode(['error' => $e->getMessage()]);
}
