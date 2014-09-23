//$(document).ready(function () {
//
//
//    grabMyPosition();
//
//});
//
////What should we do if they don't have geolocation? It should still set to somewhere. Center on San Jose?
//
//function grabMyPosition() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(centerMe);
//    } else {
//        alert("You don't support this");
//    }
//}
//
////Cache lat and lon for use later.
//function centerMe(position) {
//    var lat = position.coords.latitude;
//    var lon = position.coords.longitude;
//
//    $('#id_lat').val(lat);
//    $('#id_lon').val(lon);
//
//    mapGenerator(lat, lon);
//}
//
//function mapGenerator(lat, lon) {
//    var markers = [];
//
//    var mapOptions = {
//        center: new google.maps.LatLng(lat, lon),
//        zoom: 12,
//        mapTypeId: google.maps.MapTypeId.ROAD
//
//    };
//    var map = new google.maps.Map(
//        document.getElementById("map-canvas"),
//        mapOptions);
//
//<<<<<<< HEAD
//=======
//    //Get current data for map.
//    var mapData = httpGet('http://localhost:8000/api/v1/hazard/?format=json');
//>>>>>>> origin/master
//
//    //Get current data for map.
//    var mapData = httpGet('/api/v1/hazard/?format=json');
//    searchboxGenerator(map, markers);
//    markerGenerator(mapData, map);
//
//}
//
//function markerGenerator(mapData, map) {
//
//    //Add markers to map. Not sure if there's a better way to do this, instead of just a loop.
//    for (var i = 0; i < mapData.objects.length; i++) {
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
//            map: map,
//            animation: google.maps.Animation.DROP,
//            title: mapData.objects[i].description
//
//        });
//
//        var infoWindow = new google.maps.InfoWindow({
//            content: 'Description: ' + mapData.objects[i].description
//        });
//    }
//
//    google.maps.event.addListener(marker, 'click', function () {
//        infoWindow.open(map, marker)
//    });
//
//    //Right click wasn't working so well, but doubleclick works fine.
//    google.maps.event.addListener(map, "dblclick", function(event) {
//        var new_lat = event.latLng.lat();
//        var new_lon = event.latLng.lng();
//        // populate yor box/field with lat, lng
//        $('#id_lat').val(new_lat);
//        $('#id_lon').val(new_lon);
//    });
//}
//
//function httpGet(requestUrl) {
//
//    var xmlHttp = new XMLHttpRequest();
//    xmlHttp.open("GET", requestUrl, false);
//    xmlHttp.send(null);
//    return JSON.parse(xmlHttp.responseText);
//}
//
//function searchboxGenerator(map, markers){
//// Create the search box and link it to the UI element.
//    var input = (
//        document.getElementById('pac-input'));
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//
//    var searchBox = new google.maps.places.SearchBox(
//        (input));
//
//    // [START region_getplaces]
//    // Listen for the event fired when the user selects an item from the
//    // pick list. Retrieve the matching places for that item.
//    google.maps.event.addListener(searchBox, 'places_changed', function() {
//        var places = searchBox.getPlaces();
//
//        if (places.length == 0) {
//            return;
//        }
//        for (var i = 0, marker; marker = markers[i]; i++) {
//            marker.setMap(null);
//        }
//
//        // For each place, get the icon, place name, and location.
//        markers = [];
//        var bounds = new google.maps.LatLngBounds();
//        for (var i = 0, place; place = places[i]; i++) {
//            var image = {
//                url: place.icon,
//                size: new google.maps.Size(71, 71),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(17, 34),
//                scaledSize: new google.maps.Size(25, 25)
//            };
//
//            // Create a marker for each place.
//            var marker = new google.maps.Marker({
//                map: map,
//                icon: image,
//                title: place.name,
//                position: place.geometry.location
//            });
//
//            markers.push(marker);
//
//        }
//    });
//}

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