$(document).ready(function () {
    return grabMyPosition();
});

function grabMyPosition() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(centerMap);
    } else {
        //If geolocation doesn't work, the map defaults to San Jose.
        var lat = 37.3394444;
        var lon = -121.8938889;
        mapGenerator(lat, lon);
    }
}

// Add user's location to the report a hazard form and
// generate a map centering on those coordinates.
// If the user's location isn't available, default location is San Jose.
function centerMap(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    setFormLatLon(lat, lon);

    return mapGenerator(lat, lon);
}

//Generate the map and event listeners using lat and lon.
function mapGenerator(lat, lon) {
    var markers = [];
    var mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROAD
    };

    //Create the map at the specified element.
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions);

    //Click map to change the latitude and longitude in the form.
    google.maps.event.addListener(map, "click", function(event) {
        setFormLatLon(event.latLng.lat(), event.latLng.lng());
    });

    //Generate markers and search box.
    markerGenerator(map);
    return searchboxGenerator(map, markers);

}

//Generate map markers, info windows, and event listeners.
function markerGenerator(map) {
    //Get current data for map.
    var mapData = httpGet('/api/v1/hazard/?format=json');

    //Add markers to map.
    for (var i = 0; i < mapData.objects.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: mapData.objects[i].description,
            draggable: true

        });
        var infoWindow = new google.maps.InfoWindow({
           content: 'Description: ' + mapData.objects[i].description
        });

        //TODO(zemadi): Edit this when there are more form fields to add.
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent('Description: ' + this.title);
            infoWindow.open(map, this);
        });
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
function searchboxGenerator(map, markers){
// Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
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
                position: place.geometry.location,
                draggable: true
            });
            //Add marker to map.
            markers.push(marker);

            // Set the marker's lat and lon in the form.
            return setFormLatLon(place.geometry.location.lat(), place.geometry.location.lng());

        }
    });

}

function setFormLatLon(lat, lon) {
    $('#id_lat').val(lat);
    $('#id_lon').val(lon);
}

