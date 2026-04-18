const searchBtn = document.querySelector("#searchBtn");
const cityInput = document.querySelector("#cityInput");
const weatherResult = document.querySelector("#weatherResult");
const apiKey = "816de3afe8b8bd2fad8f9133a9441811"; 

function formatOra(unixTime) {
    // API-ul oferă secunde, dar JavaScript funcționează cu milisecunde (* 1000)
    const data = new Date(unixTime * 1000);
    // padStart(2, '0') asigură că dacă ora e 9, va afișa '09'
    const ore = data.getHours().toString().padStart(2, '0');
    const minute = data.getMinutes().toString().padStart(2, '0');
    return `${ore}:${minute}`;
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value; // salvam ce a scris utilizatorul

    if (city === "") {
        alert("Te rog introdu un oraș!");
        return; // oprim executia daca input-ul este gol
    }

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ro`;

    fetch(apiURL)
        .then(response => {
            // daca orasul nu exista serverul trimite eroarea 404
            if (!response.ok) {
                throw new Error("Orașul nu a fost găsit");
            }
            return response.json();
        })
        .then(data => { // extragem si formatam datele necesare
            const rasarit = formatOra(data.sys.sunrise);
            const apus = formatOra(data.sys.sunset);
            
            // Verificăm dacă există date pentru mare/sol (uneori API-ul nu le trimite)
            const nivelMare = data.main.sea_level ? `${data.main.sea_level} hPa` : "N/A";
            const nivelSol = data.main.grnd_level ? `${data.main.grnd_level} hPa` : "N/A";
            // Construim HTML-ul cu datele primite
            weatherResult.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" class="weather-icon">
                <div class="temp">${Math.round(data.main.temp)}°C</div>
                <p style="text-transform: capitalize;">${data.weather[0].description}</p>
                
                <div class="details">
                    <div><i class="fa-solid fa-temperature-half"></i> Se simte: ${Math.round(data.main.feels_like)}°C</div>
                    <div><i class="fa-solid fa-droplet"></i> Umiditate: ${data.main.humidity}%</div>
                    <div><i class="fa-solid fa-wind"></i> Vânt: ${data.wind.speed} m/s</div>
                    <div><i class="fa-solid fa-gauge"></i> Presiune: ${data.main.pressure} hPa</div>

                    <div><i class="fa-solid fa-water"></i> Nivel Mare: ${nivelMare}</div>
                    <div><i class="fa-solid fa-mountain"></i> Nivel Sol: ${nivelSol}</div>
                    <div><i class="fa-solid fa-sun"></i> Răsărit: ${rasarit}</div>
                    <div><i class="fa-solid fa-moon"></i> Apus: ${apus}</div>
                </div>
            `;
        })
        .catch(error => {
            // Dacă apare o eroare, o afișăm utilizatorului în locul datelor meteo
            weatherResult.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});

//  Apelați datele din https://jsonplaceholder.typicode.com/users, și să 
// afișați toate datele despre fiecare utilizator, stilizat și cu iconițe. 
// Creați o aplicație de tip Weather, afișați vremea de afară 
// (valorile tutoror proprietăților), pe baza oricărei locații (locația se citește din input), 
// proiectul trebuie să fie stilizat și cu iconițe.