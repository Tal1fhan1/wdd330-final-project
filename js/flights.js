let submit = document.getElementById("dates");
submit.addEventListener("click", confirmDates)
submit.addEventListener("click", flightListing)

let departDate
let returnDate

function confirmDates() {
    const input1 = document.getElementById("input1");
    const value1 = input1.value;

    const input2 = document.getElementById("input2");
    const value2 = input2.value;

    departDate = value1
    returnDate = value2
}

async function create() {
    let fromId
    let toId


    const heading = document.createElement("h1")
    heading.setAttribute("id", "headings")
    document.body.appendChild(heading)

    const ul = document.createElement("ul")
    ul.setAttribute("id", "flights")
    document.body.appendChild(ul)

    const url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete?query=" + localStorage.getItem("location") + "&market=US&locale=en-US";
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9f1ba8075cmsh22dffebf0d2fdb3p11dc0ejsn29c70f3053e0',
            'X-RapidAPI-Host': 'skyscanner80.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        fromId = result.data[0].id

    } catch (error) {
        console.error(error);
    }

    const url2 = "https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete?query=" + localStorage.getItem("city") + "&market=US&locale=en-US";

    try {
        const response = await fetch(url2, options);
        const result = await response.json();
        toId = result.data[0].id

    } catch (error) {
        console.error(error);
    }

    const url3 = "https://skyscanner80.p.rapidapi.com/api/v1/flights/search-roundtrip?fromId=" + fromId + "&toId=" + toId + "&departDate=" + departDate + "&returnDate=" + returnDate + "&adults=1&currency=USD&market=US&locale=en-US";

    try {
        const response = await fetch(url3, options);
        const result = await response.json();
        loading.remove()
        heading.innerHTML = `Available Flights From ${result.data.itineraries[0].legs[0].origin.name} Airport To ${result.data.itineraries[0].legs[0].destination.name} Airport`
        let length = result.data.itineraries.length

        for (let i = 0; i < length; i++) {
            localStorage.setItem("dTime1", result.data.itineraries[i].legs[0].departure)
            localStorage.setItem("dTime2", result.data.itineraries[i].legs[1].departure)

            localStorage.setItem("aTime1", result.data.itineraries[i].legs[0].arrival)
            localStorage.setItem("aTime2", result.data.itineraries[i].legs[1].arrival)


            const rating = result.data.itineraries[i].score * 10
            const listing = `<h2>${result.data.itineraries[i].legs[0].carriers.marketing[0].name}</h2>
            <h3 class="card__brand">Departure from ${result.data.itineraries[i].legs[0].origin.name} Airport:</h3> 
            <p>${localStorage.getItem("dTime1").substring(0, 10)}<br>${localStorage.getItem("dTime1").substring(11, 19)}</p>
            <h3>Arrival to ${result.data.itineraries[i].legs[0].destination.name} Airport:</h3> 
            <p>${localStorage.getItem("aTime1").substring(0, 10)}<br>${localStorage.getItem("aTime1").substring(11, 19)}</p>
            <h3>Departure from ${result.data.itineraries[i].legs[1].origin.name} Airport:</h3>
            <p>${localStorage.getItem("dTime2").substring(0, 10)}<br>${localStorage.getItem("dTime2").substring(11, 19)}</p>
            <h3>Arrival to ${result.data.itineraries[i].legs[1].destination.name} Airport:</h3> 
            <p>${localStorage.getItem("aTime2").substring(0, 10)}<br>${localStorage.getItem("aTime2").substring(11, 19)}</p>
            <a>Rating: ${rating.toFixed(1)}/10</a>
            <p class="product-card__price">${result.data.itineraries[i].price.formatted}</p>`;
            const li = document.createElement("li")
            li.innerHTML = listing
            ul.appendChild(li)
        }

    } catch (error) {
        console.error(error);
    }

}

function flightListing() {
    if (document.getElementById("flights") != null) {
        document.getElementById("flights").remove()
        document.getElementById("headings").remove()
    }
    const loading = document.createElement("h2")
    loading.setAttribute("id", "loading")
    loading.innerHTML = "Loading..."
    document.body.appendChild(loading)

    create()
}

const button = document.getElementById("search")
button.addEventListener("click", flightListing)