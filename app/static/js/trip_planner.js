var coords;
var directionsDisplay;
var map;
//var markers = [];
var travelMode;

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#trip-planner').toggleClass('active');
    //TODO(zemadi): Remove two lines below.
    $('#start').val('1900 rock st mountain view');
    $('#end').val('725 san antonio palo alto');
});

// Run these functions after setting geolocation. All except setFormDateTime() are dependent on geolocation to run.
initGeolocation().then(function (coords) {
    map = mapGenerator(coords);
    setDirectionsDisplay(map);
    formListener();
});

// Instantiate directions methods on map.
function setDirectionsDisplay(map) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
}

// Listener for if the mode of travel is changed from an empty default to either bicycling or walking.
function formListener() {
    $('#mode_travel').change(function(){
        // Launch route calculation, markers, and directions panel.
        calcRoute();
    });
}

// Once the mode of travel is selected, start calculating routes and get marker data.
function calcRoute() {
    var directionsService = new google.maps.DirectionsService();
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;

    travelMode = document.getElementById('mode_travel').value;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[travelMode]
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            // Remove existing markers from the map and map object.
            removeMarkers(true);

            queryResults = getMarkers(response);
            // Check if results are along the route.
            if (queryResults.objects.length > 0) {
                // Filter the query results further by comparing coords with each route section.
                narrowResults(queryResults.objects, response);
            // If no query results, set the marker count to 0 and generate the directions panel.
            } else {
                response.routes[0].legs[0]['marker_count'] = 0;
                generateDirectionsPanel(response);
            }
        }
    });

}

// Get markers near a route. This is done by getting the boundaries for the route as a whole and using those
// as query params.
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

    // TODO(zemadi): Look up alternatives for building the querystring.
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

    return httpGet(queryString);
}

// Function to get coordinate boundaries from the Directions route callback.
function getBounds(data) {
    var coordinateBounds = {};
    var keyByIndex = Object.keys(data);

    coordinateBounds['lat1'] = data[keyByIndex[0]]['k'];
    coordinateBounds['lat2'] = data[keyByIndex[0]]['j'];
    coordinateBounds['lon1'] = data[keyByIndex[1]]['k'];
    coordinateBounds['lon2'] = data[keyByIndex[1]]['j'];

    return coordinateBounds;
}


// Reduce the query results further by checking if they're actually along a route.

// In order for a data point to be on the route, the coordinates need to be between the values of a box in routeBoxer.
// RouteBoxer chops up a route into sections and returns the upper and lower boundaries for that section of the route.
// Refer to: http://google-maps-utility-library-v3.googlecode.com/svn/trunk/routeboxer/docs/examples.html
function narrowResults(queryResults, directionsResponse) {
    // Variables needed for routeBoxer.
    var path = directionsResponse.routes[0].overview_path;
    var rboxer = new RouteBoxer();
    var boxes = rboxer.box(path, .02); // Second param is a boundary in km from the route path.

    //Variables to hold mapData and match a marker to a specific section of the route.
    var mapData = {'objects': []};
    var markerBoxes = {};

    // For each section of the route, look through markers to see if any fit in the section's boundaries.
    for (var j = 0; j < boxes.length; j++) {
        markerBoxes[j] = [];
        queryResults.forEach(function(result) {
            // If a marker is between the latitude and longitude bounds of the route, add it to the map.
            var currentResult = new google.maps.LatLng(result.lat, result.lon);
            if (boxes[j].contains(currentResult)) {
                mapData.objects.push(result);
                markerBoxes[j].push(result);
            }
        });
    }

    if (mapData.objects.length > 0) {
        // Add new markers to the map.
        markerGenerator(map, mapData);
        // Add the count of valid markers to the directionsResponse object, which is used to generate
        // the directions panel. If there are no markers, add 'None'.
        directionsResponse.routes[0].legs[0]['marker_count'] = mapData.objects.length;
    } else {
        directionsResponse.routes[0].legs[0]['marker_count'] = 'None';
    }

    mapDirectionsToBoxes(boxes, directionsResponse, markerBoxes);

}

// Directions information also needs to be matched to a section of the route.
function mapDirectionsToBoxes(boxes, directionsResponse, markerBoxes){
    var directionsWithBoxes = {};
    var steps = directionsResponse.routes[0].legs[0].steps;

    // go through each step and set of lat lngs per step.
    for (var k = 0; k < steps.length; k++) {
        directionsWithBoxes[k] = [];
        steps[k]['markers'] = [];
        for (var l = 0; l < boxes.length; l++) {
            steps[k].lat_lngs.forEach(function(lat_lng) {
                if (directionsWithBoxes[k].indexOf(l) === -1 && boxes[l].contains(lat_lng)) {
                    directionsWithBoxes[k].push(l);
                    // Move on to the next iteration of the loop.
                    return;
                }
            });
        }

        var firstNumberInRange = directionsWithBoxes[k][0];
        var lastNumberInRange = directionsWithBoxes[k].slice(-1)[0];
        // For the current direction, look up the bound object that it's in. Use that to search for markers.
        for (var m = firstNumberInRange; m <= lastNumberInRange; m++) {
            if (markerBoxes[m].length > 0) {
                steps[k]['markers'].push.apply(steps[k]['markers'], markerBoxes[m]);
            }
        }
    }

   generateDirectionsPanel(directionsResponse);
    
}

function generateDirectionsPanel(directionsResponse) {
    //TODO(zemadi): Precompile template? Better for mobile, supposedly.
    var directionsPanelHtml = $('#custom-directions-panel').html();
    var template = Handlebars.compile(directionsPanelHtml);
    var compiledDirectionsPanel = template(directionsResponse.routes[0].legs[0]);

    var existingDirectionsPanel = $('#directions-panel');
    if (existingDirectionsPanel.length) {
        existingDirectionsPanel.replaceWith(compiledDirectionsPanel);
    } else {
      $('#row').append(compiledDirectionsPanel);
    }
}