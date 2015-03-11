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
    $('#start').val('1900 rock st mountain view');
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

// Listener for if the mode of travel is changed from an empty default to either bicycling or walking.
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
    var path = directionsResponse.routes[0].overview_path;
    var boxes = rboxer.box(path, .04);
    var mapData = {'objects': []};

    console.log(boxes);
    console.log(directionsResponse);
    // TODO(zemadi): Improve this. See if there's a way to skip routeBoxer. Avoid nested loop if possible.
    // In order for a data point to be on the route, the coordinates
    // need to be between the values of a box in routeBoxer.
    // RouteBoxer chops up a route into sections and returns the upper and lower
    // boundaries for that section of the route.

    var routeByBounds = {};
    var boundsWithData = {};
    var steps = directionsResponse.routes[0].legs[0].steps;

    // go through each step and set of lat lngs per step.
    for (var i = 0; i < boxes.length; i++) {
        routeByBounds[boxes[i]] = [];
        for (var j = 0; j < steps.length; j++) {
            //TODO(zemadi): Test this more. Is end location enough?
            if (boxes[i].contains(steps[j].end_location)) {
                routeByBounds[boxes[i]].push(steps[j]);
            }
//            for (var k = 0; k < steps[j].lat_lngs.length; k++) {
//                // If the lat and long of that path section falls in a routeBoxer bound, add it to the object.
//                if (boxes[i].contains(steps[j].lat_lngs[k])) {
//                    routeByBounds[boxes[i]].push(steps[j]);
//                }
//            }
        }
        for (var l = 0; l < queryResults.length; l++) {
            // If a marker is between the latitude and longitude bounds of the route, add it to the map.
            var currentResult = new google.maps.LatLng(queryResults[l].lat, queryResults[l].lon);
            if (boxes[i].contains(currentResult)) {
                mapData.objects.push(queryResults[l]);
                boundsWithData[boxes[i]] = queryResults[j];
            }
        }
    }
    // Build out the custom directions panel and add marker data to the path as key-value. Build custom directions
    // panel using only the directionsResponse data.
    console.log('test');
    //TODO(zemadi): Fix this so it loops through each key and looks for values.
    for (var m = 0; m < routeByBounds.length; m++) {
        console.log(routeByBounds[m]);
        if (routeByBounds[m].length > 0) {
            console.log(routeByBounds[m]);
        }
    }
  //  console.log(boundsWithData);

    // Remove existing markers from the map and map object.
    removeMarkers(true);

    if (mapData.objects.length > 0) {
        // Add new markers to the map.
        console.log(mapData.objects);
        markerGenerator(map, mapData);
    }
}

// Function to get coordinate boundaries from the Directions route callback.
// They both hold boundary data in a similar format.
function getBounds(data) {
    var coordinateBounds = {};
    var keyByIndex = Object.keys(data);

    coordinateBounds['lat1'] = data[keyByIndex[0]]['k'];
    coordinateBounds['lat2'] = data[keyByIndex[0]]['j'];
    coordinateBounds['lon1'] = data[keyByIndex[1]]['k'];
    coordinateBounds['lon2'] = data[keyByIndex[1]]['j'];

    return coordinateBounds;
}

//// Convert RouteBoxer's bounds object to a dict mapping each bound to a step on the directions path.
//function convertBounds(boxes, directionsResponse){
//    var routeByBounds = {};
//    var boundsWithData = {};
//    var steps = directionsResponse.routes[0].legs[0].steps;
//
//    // go through each step and set of lat lngs per step.
//
//    for (var i = 0; i < boxes.length; i++) {
//        for (var j = 0; j < steps.length; j++) {
//            for (var k = 0; k < steps[j].lat_lngs.length; k++) {
//                var currentResult = new google.maps.LatLng(steps[j].lat_lngs[k]['D'], steps[j].lat_lngs[k]['k']);
//                if (boxes[i].contains(currentResult)) {
//                    routeByBounds[boxes[i]] = steps[j];
//                    break;
//                }
//            }
//        }
//        for (var l = 0; l < queryResults.length; l++) {
//
//            // If a marker is between the latitude and longitude bounds of the route, add it to the map.
//            var currentResult = new google.maps.LatLng(queryResults[l].lat, queryResults[l].lon);
//            if (boxes[i].contains(currentResult)) {
//                mapData.objects.push(queryResults[l]);
//                boundsWithData[boxes[i]] = queryResults[j];
//            }
//        }
//    }
//    // Build out the custom directions panel and add marker data to the path as key-value. Build custom directions
//    // panel using only the directionsResponse data.
//
//    return routebyBounds;
//
//
//}
//
//// Function to build the custom directions panel, which holds directions and marker data.
//// TODO(zemadi) Determine if this is needed. Build this and convert to handlebars template or React?
//function buildDirectionsPanel(mapData, directionsResponse) {
//    // For now, do nothing.
//}