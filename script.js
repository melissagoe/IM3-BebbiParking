fetch("https://bebbiparking.ramisberger-tabea.ch/unload.php")
    .then(response => response.json())
    .then(data => {
        console.log(data); // Zum Debuggen

        const datenDiv = document.getElementById("daten");

        if (Array.isArray(data)) {
            // Sortieren nach Datum (neueste zuerst)
            data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Nur die neuesten 16
            const latest = data.slice(0, 16);

            // HTML erstellen
            let html = "<h2>Parkhaus Übersicht (Neueste 16)</h2>";

            latest.forEach(item => {
                html += `
          <div class="parkhaus">
            <h3>${item.title || item.address}</h3>
            <p>Freie Plätze: ${item.free} / ${item.total}</p>
            <p>Status: ${item.status}</p>
            <small>${item.timestamp}</small>
          </div>
        `;
            });

            datenDiv.innerHTML = html;
        } else {
            datenDiv.innerHTML = "<p>Fehler: Daten sind nicht im erwarteten Format.</p>";
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("daten").innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    });
