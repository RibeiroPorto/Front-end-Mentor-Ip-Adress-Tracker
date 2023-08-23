document.addEventListener('DOMContentLoaded', () => {


    const apiEndpoint = "http://ip-api.com/json"
    const ipInput = document.querySelector("#ip_or_domain")
    const ipResult = document.querySelector('#ip-result')
    const locationResult = document.querySelector('#location-result')
    const timeZoneResult = document.querySelector('#timezone-result')
    const ispResult = document.querySelector('#isp-result')

    map = setMap(),
        marker = setMarker(map, { lat: 51.505, lon: -0.09 })

    console.log(map)
    console.log(marker)
    document.querySelector('#submit-button').addEventListener('click', async () => {
        ipData = await getData(apiEndpoint, ipInput.value)
        if (dataValidation(ipData)) {
            displayResults(ipData)
            displayMap(ipData, map)
            if (marker) { marker.remove() }
            marker = setMarker(map, ipData)
            console.log(ipData)
            console.log(map)
            console.log(marker)
        }

    })
    const displayMap = (data, map) => {
        const lat = data.lat
        const lon = data.lon

        console.log(lat, lon)
        map.setView([lat, lon], 13);

    }
    const displayResults = (data) => {
        const ip = data.query
        const location = data.city + ", " + data.region
        const timeZone = parseInt(data.offset) / 3600
        const isp = data.isp

        if (timeZone.toString().length < 2) {
            // console.log(timeZone.toString())
            // console.log(timeZone.toString().length)

            utcTime = "UTC 0" + timeZone.toString() + ":00"

        } else if (timeZone.toString().length < 3) {
            if (timeZone.toString()[0] === "-") {

                utcTime = "UTC-0" + timeZone.toString()[timeZone.toString().length - 1] + ":00"
            } else {
                utcTime = "UTC" + timeZone.toString() + ":00"
            }
        } else {
            utcTime = "UTC" + timeZone.toString() + ":00"
        }
        ipResult.innerHTML = "<p>" + ip + "</p>"
        locationResult.innerHTML = "<p>" + location + "</p>"
        timeZoneResult.innerHTML = "<p>" + utcTime + "</p>"
        ispResult.innerHTML = "<p>" + isp + "</p>"
    }
    const dataValidation = (data) => {

        switch (data.status) {
            case 'fail':
                console.log(data)
                ipInput.classList.add('invalid_entry')
                ipInput.value = ""
                ipInput.placeholder = "Invalid entry, please try again."
                setTimeout(() => {
                    ipInput.classList.remove('invalid_entry')
                    ipInput.placeholder = "Search for any IP address or domain"
                }, 2000)
                break;
            case 'success':
                // console.log(data);
                return true
                break
        }

    }

})
async function getData(endPoint, ip) {
    console.log(endPoint)
    const response = await fetch(endPoint + "/" + ip + "?fields=63172607")
    const jsonData = await response.json()
    return jsonData
}

function setMap() {
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    return map
}
function setMarker(map, data) {
    const lat = data.lat
    const lon = data.lon
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>Lat: </b>${lat}<br><b>Lat: </b>${lon}`).openPopup();
    marker._icon.src = '../images/icon-location.svg'
    marker._icon.style.width = '30px'
    return marker
}