// TODO(zemadi): Make a common js file that all maps use.

var coords;
var defaultLat = 37.3394444;
var defaultLon = -121.8938889;

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#dashboard').toggleClass('active');
    return grabMyPosition();
});

function grabMyPosition() {
    var geoOptions = { maximumAge: 30000,  //  Valid for 3 minutes
        timeout: 5000,  // Wait 5 seconds
        enableHighAccuracy: true
    }

    // If there's geolocation, try to get user coords.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    } else {
        console.warn('Geolocation isnt available for this user.');
        //If geolocation isn't available, the map defaults to San Jose coordinates.
        coords = [defaultLat, defaultLon];
    }

    setTimeout(function () {
        if (!coords) {
          error();
        } else {
            window.console.log("Location was set");
        }
    }, geoOptions.timeout + 1000); // Wait extra second

}

function success(position) {
    coords = [position.coords.latitude, position.coords.longitude];
    mapGenerator();
    google.maps.event.addDomListener(window, 'load', mapGenerator());
}

function error(err) {
    //If geolocation doesn't work, the map defaults to San Jose.
    coords = [defaultLat, defaultLon];
    if (!err) {
        console.warn('Error. User didnt respond to geolocation request.');
    } else {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    mapGenerator();
    google.maps.event.addDomListener(window, 'load', mapGenerator());
}

//Generate the map and event listeners using lat and lon.
function mapGenerator() {
    var markers = [];
    var mapOptions = {
        center: new google.maps.LatLng(coords[0], coords[1]),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROAD
    };

    //Create the map at the specified element.
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions);


    //Generate markers and search box.
    markerGenerator(map);
    return searchboxGenerator(map, markers);

}

//Generate map markers, info windows, and event listeners.
function markerGenerator(map) {
    //Get current data for map.
    var contentString;
    var infoWindow = new google.maps.InfoWindow();
    var mapData = httpGet('/api/v1/hazard/?format=json');

    //Add markers to map.
    for (var i = 0; i < mapData.objects.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: mapData.objects[i].description
        });
        contentString = '<div class="infoindow">' +
            '<h4><span class="blue">User: </span>' + mapData.objects[i].user_type + '</h4>' +
            '<p> <span class="blue">Date and Time: </span>' + mapData.objects[i].date_time + '<br>' +
            '<span class="blue">Hazard: </span>' + mapData.objects[i].hazard_type + '<br>' +
            '<span class="blue">Description: </span>' + mapData.objects[i].description + '</p>' +
            '</div>';

        google.maps.event.addListener(marker, 'mouseover', (function (marker, contentString) {
            return function () {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, contentString));
    }
    return marker;
}

//Get data from API to generate markers.
function httpGet(requestUrl) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestUrl, false);
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText);
}

//Add searchbox to map. When place is selected, add markers and lat and lon to form.
function searchboxGenerator(map, markers) {
// Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            //Center the map on the new marker's location.
            map.panTo(place.geometry.location);
            //Add marker to map.
            markers.push(marker);

            return true;

        }
    });

}

