var coords;
var directionsDisplay;
var map;
var travelMode;
var travelModeElement = $('#mode_travel');

// Order of operations for the trip planner (each function will have detailed notes):
// 1) Calculate a user's route, with directions.
// 2) Run a query using the route's max and min bounds to narrow potential results.
// 3) Just because a marker is in the area of the route, it doesn't mean that it's on the route.
//    Use RouteBoxer to map sections of the route to markers, if applicable. Display only those markers on the map.
// 4) The directions panel also isn't linked to a section of the route.
//    Use RouteBoxer to map a direction (turn left, right, etc) to part of the route.
// 5) Build the custom directions panel by looping though each leg of the trip, finding the corresponding RouteBoxer
//    section, and use that to get markers for that section only.

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#trip-planner').toggleClass('active');
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
    travelModeElement.change(function(){
        // Launch route calculation, markers, and directions panel.
        calcRoute();
    });
}

// Once the mode of travel is selected, start calculating routes and get marker data.
function calcRoute() {
    var directionsService = new google.maps.DirectionsService();
    var start = $('#start').val();
    var end = $('#end').val();

    travelMode = travelModeElement.val();
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
    var boxes = rboxer.box(path, .03); // Second param is a boundary in km from the route path.

    //Variables to hold mapData and match a marker to a specific section of the route.
    var mapData = {'objects': []};
    // Object to hold routeBoxer index to markers map.
    var mapBoxesAndMarkers = {};

    // For each section of the route, look through markers to see if any fit in the section's boundaries.
    // Using a for loop here because routeBoxer returns an array.
    for (var j = 0, b=boxes.length; j < b; j++) {
        // For each section of the route, record the index as a key and create an empty array to hold marker values.
        mapBoxesAndMarkers[j] = [];
        queryResults.forEach(function(result) {
            // If a marker is between the latitude and longitude bounds of the route, add it to the map and
            // the route-marker dict.
            var currentResult = new google.maps.LatLng(result.lat, result.lon);
            if (boxes[j].contains(currentResult)) {
                mapData.objects.push(result);
                mapBoxesAndMarkers[j].push(result);
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

    mapDirectionsToBoxes(boxes, directionsResponse, mapBoxesAndMarkers);

}

// Directions information also needs to be mapped to a section of the route.
function mapDirectionsToBoxes(boxes, directionsResponse, mapBoxesAndMarkers){
    var directions = directionsResponse.routes[0].legs[0].steps;

    // go through each step and set of lat lngs per step.
     directions.forEach(function(direction) {
        var routeBoxesinDirection = [];
        for (var l = 0, b=boxes.length; l < b; l++) {
            direction.lat_lngs.forEach(function(lat_lng) {
                // If the index isn't already in the array and the box contains the current route's lat and long, add the
                // index.
                if (routeBoxesinDirection.indexOf(l) === -1 && boxes[l].contains(lat_lng)) {
                    routeBoxesinDirection.push(l);
                }
            });
        }

        // Once we're done looping over route boxes for the current direction, lookup markers that have the same bounds.
        // A direction can have multiple route boxes so a list is being used here.
        direction['markers'] = [];
        routeBoxesinDirection.forEach(function(box) {
            if (mapBoxesAndMarkers[box].length > 0) {
                // Use the route box to look up arrays of markers to add to the directions object.
                direction['markers'].push.apply(direction['markers'], mapBoxesAndMarkers[box]);
            }
        });
    });

   generateDirectionsPanel(directionsResponse);
    
}

function generateDirectionsPanel(directionsResponse) {
    var directionsPanel = $('#directions-panel');
    var directionsPanelHtml = $('#directions-panel-template').html();
    var newSearchTrigger = $('#new-search-trigger');
    var template = Handlebars.compile(directionsPanelHtml);
    var compiledDirectionsPanel = template(directionsResponse.routes[0].legs[0]);

    if (directionsPanel[0].children.length > 0) {
       directionsPanel[0].innerHTML = compiledDirectionsPanel;
    } else {
      directionsPanel.append(compiledDirectionsPanel);
    }

    // Close the trip planner form and display the directions panel.
    $('#trip-planner-form').addClass('closed');
    directionsPanel.removeClass('closed');
    newSearchTrigger.removeClass('hidden');

    // Listen for a new search event, which shows the form and closes the directions panel.
    newSearchTrigger.click(function(){
        directionsPanel.addClass('closed');
        newSearchTrigger.addClass('hidden');
        $('#trip-planner-form').removeClass('closed');
    });
}