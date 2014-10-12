$(document).ready(function () {

    return grabMyPosition();

});

//What should we do if they don't have geolocation? It should still set to somewhere. Center on San Jose?
// Separate functionality for index map page and reporting map page.c

function grabMyPosition() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(centerMap);
    } else {
        alert("Please enable geolocation to continue.");
    }
}

function centerMap(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    setFormLatLon(lat, lon);

    return mapGenerator(lat, lon);
}

function mapGenerator(lat, lon) {
    var markers = [];

    var mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROAD

    };
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions);

    //Click map to change the latitude and longitude in the form.
    google.maps.event.addListener(map, "click", function(event) {
        setFormLatLon(event.latLng.lat(), event.latLng.lng());
    });

    //Get current data for map.
    var mapData = httpGet('/api/v1/hazard/?format=json');
    searchboxGenerator(map, markers);

    return markerGenerator(mapData, map);

}

function markerGenerator(mapData, map) {

    //Add markers to map. Not sure if there's a better way to do this, instead of just a loop.
    for (var i = 0; i < mapData.objects.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: mapData.objects[i].description,
            draggable: true

        });

        var infoWindow = new google.maps.InfoWindow();

        infoWindow.setOptions({
            content: 'Description: ' + mapData.objects[i].description
        });

        //TODO(zemadi): Edit this when there are more form fields to add.
        google.maps.event.addListener(marker, 'click', function() {
            new google.maps.InfoWindow({
                content: 'Description: ' + this.title
            }).open(map, this);

        });
    }
}

function httpGet(requestUrl) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestUrl, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function searchboxGenerator(map, markers){
// Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox(input);

    // [START region_getplaces]
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

            markers.push(marker);

            return setFormLatLon(place.geometry.location.lat(), place.geometry.location.lng());

        }
    });

}

function setFormLatLon(lat, lon) {
    $('#id_lat').val(lat);
    $('#id_lon').val(lon);
}

