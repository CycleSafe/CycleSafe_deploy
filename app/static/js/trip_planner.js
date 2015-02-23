// TODO(zemadi): Add places search to form.

var coords;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var markers = [];
var rboxer = new RouteBoxer();
var travelMode;

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#trip-planner').toggleClass('active');
    //TODO(zemadi): Remove two lines below.
    $('#start').val('1901 rock st mountain view');
    $('#end').val('725 san antonio palo alto');
});

// Run these functions after setting geolocation. All except setFormDateTime() are dependent on geolocation to run.
initGeolocation().then(function (coords) {
    map = mapGenerator(coords);
    setDirectionsDisplay(map);
    formListener();
});


function setDirectionsDisplay(map) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
}

function formListener() {
    $('#mode_travel').change(function(){
       calcRoute();
    });
}

function calcRoute() {
    travelMode = document.getElementById('mode_travel').value;
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[travelMode]
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            queryResults = getMarkers(response);

            if (queryResults.objects.length > 0) {
                // Filter the query results further by comparing coords with each route section.
                narrowResults(queryResults.objects, response);
            }
        }
    });

}

// Get markers around the route. This is done by getting the boundaries for the route
// as a whole and using those as query params.
function getMarkers(response){
    var userType;
    if (travelMode == "BICYCLING") {
        userType = 1;
    } else {
        userType = 2;
    }

    // Build the query string, limiting the results for cyclists and pedestrians.
    var queryString = '/api/v1/hazard/?format=json&?user_type=' + userType;

    // Get the maximum and minimum lat/lon bounds for the route.
    // This will narrow the query to a box around the route as a whole.
    var routeBounds = getBounds(response.routes[0].bounds);

    //Build the querystring. Negative numbers require different greater/less than logic,
    // so testing for that here.
    if (routeBounds.lat1 >= 0 && routeBounds.lat2 >= 0) {
        queryString += '&lat__gte=' + routeBounds.lat1 + '&lat__lte=' + routeBounds.lat2;
    } else {
        queryString += '&lat__gte=' + routeBounds.lat2 + '&lat__lte=' + routeBounds.lat1;
    }

    if (routeBounds.lon1 >= 0 && routeBounds.lon2 >= 0) {
        queryString += '&lon__gte=' + routeBounds.lon1 + '&lon__lte=' + routeBounds.lon2;
    } else {
        queryString += '&lon__gte=' + routeBounds.lon2 + '&lon__lte=' + routeBounds.lon1;
    }

    // Run the query.
    queryResults = httpGet(queryString);

    return queryResults
}

function narrowResults(queryResults, directionsResponse) {
    // RouteBoxer chops up the user's route into sections.
    // Refer to: http://google-maps-utility-library-v3.googlecode.com/svn/trunk/routeboxer/docs/examples.html
    var distance = .04;
    var path = directionsResponse.routes[0].overview_path;
    var boxes = rboxer.box(path, distance);
    var mapData = {'objects': []};

    // TODO(zemadi): Improve this. See if there's a way to skip routeBoxer. Avoid nested loop if possible.
    for (var i = 0; i < boxes.length; i++) {
        var sectionBounds = getBounds(boxes[i]);

        // In order for a data point to be on the route, the coordinates
        // need to be between the values of a box in routeBoxer.
        // RouteBoxer chops up a route into sections and returns the upper and lower
        // boundaries for that section of the route.

        for (var j = 0; j < queryResults.length; j++) {
            var currentLat = parseFloat(queryResults[j].lat);
            var currentLon = parseFloat(queryResults[j].lon);
            var latArraySort = [currentLat, sectionBounds.lat1, sectionBounds.lat2].sort();
            var lonArraySort = [currentLon, sectionBounds.lon1, sectionBounds.lon2].sort();

            // If a marker is between the latitude and longitude bounds of the route (index 1), add
            // it to the map.
            if (latArraySort.indexOf(currentLat) === 1) {
                if (lonArraySort.indexOf(currentLon) === 1) {
                    mapData.objects.push(queryResults[j]);

                    // Build the text for the warning message.
                    // Add a description to the warning message.
                    if (queryResults[j].description) {
                        var more_information = 'Details: ' + queryResults[j].description;
                        directionsResponse.routes[0].warnings.unshift(more_information);
                    }
                    // Add the hazard type and address.
                    var address = coordsToAddress([queryResults[j].lat, queryResults[j].lon]);
                    var partialAddress = [address.results[0].address_components[0].short_name, address.results[0].address_components[1].short_name];
                    var markerWarning = [queryResults[j].hazard_type, 'near', partialAddress.join(' ')];
                    directionsResponse.routes[0].warnings.unshift(markerWarning.join(' '));
                }
            }
        }
    }

    // Add general hazard info to the warnings section.
    // TODO(zemadi): Make custom directions panel so it combines marker and directions data.
    var warningText = [];
    if (mapData.length === 1) {
        Array.prototype.push.apply(warningText, ['There is', mapData.objects.length,  'hazard along your route.']);
    } else {
        Array.prototype.push.apply(warningText, ['There are', mapData.objects.length, 'hazards along your route.']);
    }
    directionsResponse.routes[0].warnings.unshift(warningText.join(' '));
    // Remove existing markers from the map and map object.
    removeMarkers(true);

    if (mapData.objects.length > 0) {
        // Add new markers to the map.
        markerGenerator(map, mapData);
    }
}

// Function to get coordinate boundaries from the Directions route callback and RouteBoxer.
// They both hold boundary data in a similar format.
function getBounds(data){
    var coordinateBounds = {};
    var keyByIndex = Object.keys(data);

    coordinateBounds['lat1'] = data[keyByIndex[0]]['k'];
    coordinateBounds['lat2'] = data[keyByIndex[0]]['j'];
    coordinateBounds['lon1'] = data[keyByIndex[1]]['k'];
    coordinateBounds['lon2'] = data[keyByIndex[1]]['j'];

    return coordinateBounds;
}