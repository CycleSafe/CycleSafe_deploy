// Common js file for all maps.

var coords;
var defaultLat = 37.3394444;
var defaultLon = -121.8938889;
var deferred = new $.Deferred();
var mapMarkers = [];

//Run geolocation checks. Success and error callbacks are separate functions.
function initGeolocation() {
    var geoOptions = {
        maximumAge: 30000,  //  Valid for 3 minutes
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
            deferred.resolve(coords);
        } else {
            window.console.log("Location was set");
        }
    }, geoOptions.timeout + 1000); // Wait extra second

    return deferred.promise();

}

// Successful geolocation request.
function success(position) {
    coords = [position.coords.latitude, position.coords.longitude];
    deferred.resolve(coords);

    return coords;
}

// Error with geolocation request or non-response from user.
function error(err) {
    //The map defaults to San Jose.
    if (!err) {
        console.warn('Error. User didnt respond to geolocation request.');
    } else {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    coords = [defaultLat, defaultLon];
    deferred.resolve(coords);

    return true;
}


//Generate the map and event listeners using lat and lon, set map center to user's location.
function mapGenerator(coords) {
    var mapOptions = {
        center: new google.maps.LatLng(coords[0], coords[1]),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROAD
    };

    //Create the map at the specified element.
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions);

    // TODO(zemadi): Build a limit on the query so only data points within the map bounds are displayed.
    httpGet('/api/v1/hazard/?format=json', markerGenerator.bind(this, map));

    return map;

}

//Generate map markers, info windows, and event listeners.
function markerGenerator(map, mapData) {
    //Get current data for map.
    var contentString;
    var infoWindow = new google.maps.InfoWindow();

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
        mapMarkers.push(marker);
    }
    return mapMarkers;
}

// Hide and optionally remove all existing markers from a map and the map object.
function removeMarkers(deleteMarkers) {
    // Hide the markers on the map.
    for(i = 0; i < mapMarkers.length; i++) {
        mapMarkers[i].setMap(null);
    }

   // If the markers should be deleted completely, reset map markers to an empty array.
    if (deleteMarkers) {
        mapMarkers = []
    }
}

// Adds places search to an input. If needed, positions the searchbox in the top-left of its parent.
// opt_setLatLon: Optional boolean used in index and report map views.
function searchBoxGenerator(searchBoxSelector, opt_setLatLon) {
    // Create the search box and link it to the UI element.
    var placesInputs = $(searchBoxSelector);
    var searchBoxes = [];

    for (var a = 0; a < placesInputs.length; a++) {
        var searchBox = new google.maps.places.SearchBox(placesInputs[a]);
        searchBoxes.push(searchBox);
    }

    if (opt_setLatLon) {
        searchBoxSetLatLon(searchBoxes);
    }
}

// Set a latitude and longitude on the map for index and report map views.
function searchBoxSetLatLon(searchBoxes){
    var markers = [];
    var searchBox = searchBoxes[0];

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

            // Set the marker's lat and lon in the form.
            var lat = place.geometry.location.lat();
            var lon = place.geometry.location.lng();

            return setFormLatLon(lat, lon, '#id_lat', '#id_lon');
        }
    });
}

//Set latitude and longitude in forms.
function setFormLatLon(lat, lon, element1, element2) {
    if (!element2) {
        $(element1).val(lat + ', ' + lon);
    } else {
        $(element1).val(lat);
        $(element2).val(lon);
    }

    return true;
}

// Special numeric sort function to account for negative values.
function compareNumbers(a, b) {
  return a - b;
}

//Get data from API to generate markers. Callback function is optional.
function httpGet(requestUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestUrl, true);

    xmlHttp.onload = function (e) {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
            // If there's a callback, call it and pass in the response. If not, return the response.
            return callback ? callback(JSON.parse(xmlHttp.responseText)) : JSON.parse(xmlHttp.responseText);
        } else {
          return console.error(xmlHttp.statusText);
        }
      }
    };
    xmlHttp.onerror = function (e) {
      return console.error(xmlHttp.statusText);
    };

    xmlHttp.send(null);
}