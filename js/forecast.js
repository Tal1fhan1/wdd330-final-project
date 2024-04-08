if (document.getElementById("weather-cards") == null) {
    weatherListing()
}

async function create() {
    const lat = localStorage.getItem("destination latitude")
    const long = localStorage.getItem("destination longitude")

    const heading = document.createElement("h1")
    heading.setAttribute("id", "heading")
    document.body.appendChild(heading)

    const ul = document.createElement("ul")
    ul.setAttribute("id", "weather-cards")
    document.body.appendChild(ul)

    const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=6f7485277746b0ae1a06c3ffc7583e18&units=imperial"

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            loading.remove()
            heading.innerHTML = `5-Day/3 Hour Weather Forecast For ${localStorage.getItem('city')}`
            for (let i = 0; i <= 39; i++) {
                const listing = `<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="Icon depicting ${data.list[i].weather[0].description}">
            <h3 class="card__brand">${data.list[i].weather[0].description}</h3>
            <a>${data.list[i].main.temp}&deg;F</a>
            <p class="product-card__price">${data.list[i].dt_txt}</p>`;
                const li = document.createElement("li")
                li.innerHTML = listing
                ul.appendChild(li)
            }
        }
        else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }

}

function weatherListing() {
    if (document.getElementById("weather-cards") != null) {
        document.getElementById("weather-cards").remove()
        document.getElementById("heading").remove()
    }
    const loading = document.createElement("h2")
    loading.setAttribute("id", "loading")
    loading.innerHTML = "Loading..."
    document.body.appendChild(loading)

    create()
}

const button = document.getElementById("search")
button.addEventListener("click", weatherListing)