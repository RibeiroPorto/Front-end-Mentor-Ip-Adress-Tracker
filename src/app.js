import API_KEY from './config.js'
document.addEventListener('DOMContentLoaded', () => {
    //creating variables for the API and the input for ip
    const apiEndpoint = "https://api.ipgeolocation.io/ipgeo?apiKey="
    const ipInput = document.querySelector("#ip_or_domain")
    //placing the map and the marker in predefined inicial locations
    var map = setMap()
    var marker = setMarker(map, { latitude: 34.05430, longitude: -118.08212 })

    document.querySelector('#submit-button').addEventListener('click', async () => {
        //when the button is clicked  we call getData to fetch the api with the value of the ipInput
        var ipData = await getData(apiEndpoint, API_KEY, ipInput.value)
        //the json data recieved from the api is checked in the funciton dataIsValid 
        if (dataIsValid(ipData)) {
            //if the data is valid and display the results  and set a new location for the map and the marker
            displayResults(ipData)
            displayMap(ipData, map)
            marker.remove()
            marker = setMarker(map, ipData)
        } else {
            //if the data is not valid we show it to the user in the ipInput for 2 seconds 
            ipInput.classList.add('invalid_entry')
            ipInput.value = ""
            ipInput.placeholder = "Invalid entry, please try again."
            setTimeout(() => {
                ipInput.classList.remove('invalid_entry')
                ipInput.placeholder = "Search for any IP address or domain"
            }, 2000)
        }
    })


})
const displayResults = (data) => {
    //to display the data we create the variables for the elements
    const ipResult = document.querySelector('#ip-result')
    const locationResult = document.querySelector('#location-result')
    const timeZoneResult = document.querySelector('#timezone-result')
    const ispResult = document.querySelector('#isp-result')
    //then we take the data from the json supplied by the api
    const ip = data.ip
    const location = data.city + ", " + data.country_name + ", " + data.zipcode
    const timeZone = parseInt(data.time_zone.offset)
    const isp = data.isp

    //As the timezone of the api comes in a "simple form" like (-3) we format it to: -03:00
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
    //finally we display the formatted data in the elements
    ipResult.innerHTML = "<p>" + ip + "</p>"
    locationResult.innerHTML = "<p>" + location + "</p>"
    timeZoneResult.innerHTML = "<p>" + utcTime + "</p>"
    ispResult.innerHTML = "<p>" + isp + "</p>"
}
const displayMap = (data, map) => {
    //sets a new view for the map based on the latitude and longitude in the data
    const lat = data.latitude
    const lon = data.longitude
    map.setView([lat, lon], 13);

}

const dataIsValid = (data) => {
    //when the API receives a data it cant lookup, due to it's not an IP it returns a message inside the json 
    //so if the message is undefined it means that the data is valid otherwise it's not
    console.log(data.message)
    switch (data.message) {
        case undefined:
            return true
        default:
            return false
    }

}
async function getData(endPoint, API_KEY, ip) {
    //the API is fetched with the API_KEY the ip received and the data is returned in json
    const response = await fetch(endPoint + API_KEY + "&ip=" + ip)
    const jsonData = await response.json()
    return jsonData
}


function setMarker(map, data) {
    //the marker is added to the map in the location indicated in the data and  is returned 
    const lat = data.latitude
    const lon = data.longitude
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>Lat: </b>${lat}<br><b>Lat: </b>${lon}`).openPopup();
    //here i changed the icon of the marker and its width
    marker._icon.src = './images/icon-location.svg'
    marker._icon.style.width = '30px'
    return marker
}
function setMap() {
    //the map is created in the div with the class 'map', then it's returned
    var map = L.map('map').setView([34.05430, -118.08212], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    return map
}