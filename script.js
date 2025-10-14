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
            });


            const infoContainer = document.querySelector("#info-container");
            const parkhaueser = document.querySelectorAll(".parkhaus");
            parkhaueser.forEach(parkhaus => {
                parkhaus.addEventListener("click", () => {
                    // alert("Klicken auf Parkhaus mit ID: " + parkhaus.id);
                    let item = parkhaueserDaten.get(parkhaus.id);
                    console.log(item);
                    infoContainer.innerHTML = `
                        <h2>${item.title}</h2>
                        <h3>${item.address}</h3 >
                        <p>Freie Plätze: ${item.free} / ${item.total}</p>
                        <p>Status: ${item.status}</p>
                    
                    `;
                    infoContainer.classList.remove("hidden");

                    // Aktivieren (z. B. sichtbar machen)
                    infoContainer.classList.add("active");

                    // Nach 5 Sekunden (5000 ms) wieder ausblenden
                    setTimeout(() => {
                        infoContainer.classList.remove("active"); // Animation/Anzeige beenden
                        infoContainer.classList.add("hidden");    // optional: wieder verstecken
                        container.innerHTML = "";                 // Inhalt löschen
                    }, 5000);
                });
            });




        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("daten").innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    });
