
$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#report-hazard').toggleClass('active');
    setFormDefaults();
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
    var contentString;
    var infoWindow = new google.maps.InfoWindow();
    var mapData = httpGet('/api/v1/hazard/?format=json');

    //Add markers to map.
    for (var i = 0; i < mapData.objects.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData.objects[i].lat, mapData.objects[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,
            title: mapData.objects[i].description,

        });
        contentString = '<div class="infoindow">' +
            '<h4><span class="blue">User: </span>' + mapData.objects[i].user_type + '</h4>' +
            '<p> <span class="blue">Date and Time: </span>' + mapData.objects[i].date_time + '<br>' +
            '<span class="blue">Hazard: </span>' + mapData.objects[i].hazard_type + '<br>' +
            '<span class="blue">Description: </span>' + mapData.objects[i].description + '</p>' +
            '</div>';

        google.maps.event.addListener(marker, 'mouseover', (function(marker, contentString) {
            return function() {
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
            });

            //Center the map on the new marker's location.
            map.panTo(place.geometry.location);
            //Add marker to map.
            markers.push(marker);

            // Set the marker's lat and lon in the form.
            return setFormLatLon(place.geometry.location.lat(), place.geometry.location.lng());

        }
    });

}

function setFormDefaults() {
   var localDateTime = new Date();
   var formattedDate = (localDateTime.getMonth()+1) + '/' + localDateTime.getDate() + '/' +  localDateTime.getFullYear() + ' ' + localDateTime.getHours() + ':' + ('0'+localDateTime.getMinutes()).slice(-2);
   $('#id_date_time').val(formattedDate);
}


function setFormLatLon(lat, lon) {
    $('#id_lat').val(lat);
    $('#id_lon').val(lon);
}