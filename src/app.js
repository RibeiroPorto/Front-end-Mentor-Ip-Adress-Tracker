import API_KEY from './config.js'
document.addEventListener('DOMContentLoaded', () => {
     const apiEndpoint = "https://api.ipgeolocation.io/ipgeo?apiKey="
    const ipInput = document.querySelector("#ip_or_domain")
    const ipResult = document.querySelector('#ip-result')
    const locationResult = document.querySelector('#location-result')
    const timeZoneResult = document.querySelector('#timezone-result')
    const ispResult = document.querySelector('#isp-result')

    var map = setMap()
    var marker = setMarker(map, { latitude: 34.05430, longitude: -118.08212 })

    document.querySelector('#submit-button').addEventListener('click', async () => {
        var ipData = await getData(apiEndpoint, API_KEY, ipInput.value)
        console.log(ipData)
        if (dataIsValid(ipData)) {
            displayResults(ipData)
            displayMap(ipData, map)
            if (marker) { marker.remove() }
            marker = setMarker(map, ipData)
        }else{
            ipInput.classList.add('invalid_entry')
            ipInput.value = ""
            ipInput.placeholder = "Invalid entry, please try again."
            setTimeout(() => {
                ipInput.classList.remove('invalid_entry')
                ipInput.placeholder = "Search for any IP address or domain"
            }, 2000)
        }
    })
    const displayResults = (data) => {
        const ip = data.ip
        const location = data.city + ", " + data.country_name + ", " + data.zipcode
        const timeZone = parseInt(data.time_zone.offset) 
        const isp = data.isp
    
        if (timeZone.toString().length < 2) {
            utcTime = "UTC 0" + timeZone.toString() + ":00"
        } else if (timeZone.toString().length < 3) {
            if (timeZone.toString()[0] === "-") {
    
                var utcTime = "UTC-0" + timeZone.toString()[timeZone.toString().length - 1] + ":00"
            } else {
                var utcTime = "UTC" + timeZone.toString() + ":00"
            }
        } else {
            var utcTime = "UTC" + timeZone.toString() + ":00"
        }
        ipResult.innerHTML = "<p>" + ip + "</p>"
        locationResult.innerHTML = "<p>" + location + "</p>"
        timeZoneResult.innerHTML = "<p>" + utcTime + "</p>"
        ispResult.innerHTML = "<p>" + isp + "</p>"
    }

})
const displayMap = (data, map) => {
    const lat = data.latitude
    const lon = data.longitude
    console.log(lat, lon)
    map.setView([lat, lon], 13);

}

const dataIsValid = (data) => {

    switch (data.message) {
        case undefined:
            
            return true
            break
        default:
            return false
            
            break;
    }

}
async function getData(endPoint,API_KEY, ip) {
    console.log(endPoint + API_KEY + "&ip=" + ip + "&"+"Accept-Charset: UTF-8")
    const response = await fetch(endPoint + API_KEY + "&ip=" + ip + "&"+"Accept-Charset: UTF-8")
    const jsonData = await response.json()
    return jsonData
}

function setMap() {
    var map = L.map('map').setView([34.05430, -118.08212], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    return map
}
function setMarker(map, data) {
    const lat = data.latitude
    const lon = data.longitude
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>Lat: </b>${lat}<br><b>Lat: </b>${lon}`).openPopup();
    marker._icon.src = './images/icon-location.svg'
    marker._icon.style.width = '30px'
    return marker
}