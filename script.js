console.log("Hello, World!");

fetch("https://bebbiparking.ramisberger-tabea.ch/unload.php")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

