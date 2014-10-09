$(document).ready(function () {


    initLocationControls();

});

function initLocationControls() {

    if (Modernizr.geolocation) {
        navigator.geolocation.getCurrentPosition(locationData, locationError);
    } else {
        return false;
    }

}

//If geolocation doesn't work, run an error message.
function locationError() {
    alert('Please enable geolocation to continue.');
    return false;
}

//Collects location data of the user.
function locationData(position) {
    //We'll need these variables for the map and the report a hazard form.
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    //Set multiple values to form. Need to load this only in report.
    $('#id_lat').val(lat);
    $('#id_lon').val(lon);

    mapGenerator(lat, lon);

}

function mapGenerator(lat, lon) {
    var mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROAD

    };
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions);

    //Get current data for map.
    var mapData = httpGet('http://localhost:8000/api/v1/hazard/?format=json');

    markerGenerator(mapData, map);
}

function markerGenerator(mapData, map) {

    //Add markers to map. Not sure if there's a better way to do this, instead of just a loop.
    for (var i = 0; i < mapData.objects.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: mapData.objects[i].description

        });

        var infoWindow = new google.maps.InfoWindow({
            content: 'Description: ' + mapData.objects[i].description
        });
    }

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker)
    });
}

function httpGet(requestUrl) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestUrl, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}