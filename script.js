let prognoseChart = null;

let topFreeParking = [];

const infoContainer = document.querySelector("#info-container");
const schalter = document.querySelector('#schalter');
const karteImg = document.querySelector('#karte-img');

const parkhaueser = document.querySelectorAll(".parkhaus");

let istGeschalten = false;

fetch("https://bebbiparking.ramisberger-tabea.ch/unload.php")
    .then(response => response.json())
    .then(data => {
        console.log(data); // Zum Debuggen

        //const datenDiv = document.getElementById("daten");

        const parkhaueserDaten = new Map();

        const parkhaueserIDMap = new Map();
        parkhaueserIDMap.set("Parkhaus Storchen", "storchen");
        parkhaueserIDMap.set("Parkhaus City", "city");
        parkhaueserIDMap.set("Parkhaus Europe", "europe");
        parkhaueserIDMap.set("Parkhaus Rebgasse", "rebgasse");
        parkhaueserIDMap.set("Parkhaus Aeschen", "aeschen");
        parkhaueserIDMap.set("Parkhaus Claramatte", "claramatte");
        parkhaueserIDMap.set("Parkhaus Centralbahn", "centralbahn");
        parkhaueserIDMap.set("Parkhaus Bahnhof Süd", "sued");
        parkhaueserIDMap.set("Parkhaus Elisabethen", "elisabethen");
        parkhaueserIDMap.set("Parkhaus Steinen", "steinen");
        parkhaueserIDMap.set("Parkhaus Bad. Bahnhof", "bad_bahnhof");
        parkhaueserIDMap.set("Parkhaus Messe", "messe");
        parkhaueserIDMap.set("Parkhaus Clarahuus", "clarahuus");
        parkhaueserIDMap.set("Parkhaus Post Basel", "post");
        parkhaueserIDMap.set("Parkhaus Anfos", "anfos");
        parkhaueserIDMap.set("Parkhaus Kunstmuseum", "kunstmuseum");


        if (Array.isArray(data)) {
            // Sortieren nach Datum (neueste zuerst)
            data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Nur die neuesten 16
            const latest = data.slice(0, 16);

            //Parkhäuser zu ID Mappen
            latest.forEach(item => {
                const parkhausID = parkhaueserIDMap.get(item.title);
                parkhaueserDaten.set(parkhausID, item);
                console.log(item);

                //Parkhäuser (SVG in HTML) mit über 80% Auslastung kriegen klasse "gefuellt"
                const parkhausElement = document.getElementById(parkhausID);
                if (item.auslastung >= 80) {
                    parkhausElement.classList.add("gefuellt");
                }
            });

            // Top 5 Parkhäuser mit den meisten freien Plätzen ["Parkhaus Storchen", 120]
            topFreeParking = latest
                .map(item => [item.title, item.free])
                .sort((a, b) => b[1] - a[1]) // Sortieren nach freien Plätzen (absteigend)
                .slice(0, 5); // Nur die Top 5
            console.log("Top 5 Parkhäuser mit den meisten freien Plätzen:", topFreeParking);



            parkhaueser.forEach(parkhaus => {
                parkhaus.addEventListener("click", () => {
                    if (istGeschalten === false) {
                        const containerInformation = document.querySelector("#container-information");
                        // alert("Klicken auf Parkhaus mit ID: " + parkhaus.id);
                        let item = parkhaueserDaten.get(parkhaus.id);
                        console.log(item);
                        containerInformation.innerHTML = `
                        <h2>${item.title}</h2>
                        <h3>${item.address}</h3 >
                        <p>Freie Plätze: ${item.free} / ${item.total}</p>
                        <p>Status: ${item.status}</p>
                    `;

                        // Chart aktualisieren
                        renderPrognoseChart(item.title, data, parkhaueserIDMap);

                        infoContainer.classList.remove("hidden");

                        // Aktivieren (z. B. sichtbar machen)
                        infoContainer.classList.add("active");

                        // Nach 10 Sekunden (5000 ms) wieder ausblenden
                        setTimeout(() => {
                            infoContainer.classList.remove("active"); // Animation/Anzeige beenden
                            infoContainer.classList.add("hidden");    // optional: wieder verstecken
                            //containerInformation.innerHTML = "";                 // Inhalt löschen
                        }, 10000);
                    }
                });
            });




        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("daten").innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    });



schalter.addEventListener('change', () => {
    if (schalter.checked == false) {
        istGeschalten = true;
        document.body.classList.add('geschalten');
        karteImg.src = 'IMG/Map_geschalten.png';
        infoContainer.innerHTML = `
        <div id="container-information">
            <h2>Top 5 Parkhäuser</h2>
            <ol>
                ${topFreeParking.map(parkhaus => `<li class="top-liste-item">${parkhaus[0]}: ${parkhaus[1]} freie Plätze</li>`).join('')}
            </ol>
            </div>`;
    } else {
        istGeschalten = false;
        document.body.classList.remove('geschalten');
        karteImg.src = 'IMG/Map.png';
        infoContainer.innerHTML = `
        <div id="container-information">
        </div>

        <div class="chart-container">
            <canvas id="prognoseChart"></canvas>
        </div>`;
    }
});




function renderPrognoseChart(parkhausName, allData, parkhaueserIDMap) {
    const parkhausKey = parkhaueserIDMap.get(parkhausName);
    if (!parkhausKey) return;

    // aktuelles Datum
    const now = new Date();
    //now.setDate(now.getDate() - 7) //eine Woche zurücksetzen

    // Ende = Mitternacht gestern (00:00 heute)
    const end = new Date(now);
    end.setHours(0, 0, 0, 0); // heutiger Tagesbeginn (00:00)

    // Start = Mitternacht vor 2 Tagen (00:00 12. Oktober)
    const start = new Date(end);
    start.setDate(start.getDate() - 2);
    //start.setDate(start.getDate() - 8);

    // Filtere nach Adresse oder Titel (je nach API-Struktur)
    const filtered = allData.filter(entry => {
        const timestamp = new Date(entry.timestamp);
        const isSameParkhaus =
            entry.title === parkhausName ||
            (entry.address && entry.address.toLowerCase().includes(parkhausKey));

        const isInLastFullDay = timestamp >= start && timestamp < end;
        return isSameParkhaus && isInLastFullDay;
    });

    if (filtered.length === 0) {
        console.warn("Keine Verlaufdaten gefunden für", parkhausName);
        return;
    }

    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const labels = filtered.map(e =>
        new Date(e.timestamp).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })
    );

    const values = filtered.map(e => e.auslastung);

    const ctx = document.getElementById("prognoseChart");

    // alten Chart zerstören, falls vorhanden
    if (prognoseChart) prognoseChart.destroy();

    prognoseChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: `${parkhausName} – Auslastung (%)`,
                data: values,
                borderColor: "#9581B5",
                backgroundColor: "#AD8ED0",
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: {
                    display: false,
                    text: `Auslastung der letzten 24 Stunden (${parkhausName})`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100
                }
            }
        }
    });
}