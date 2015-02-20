// TODO(zemadi): Add places search to form.

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var rboxer = new RouteBoxer();
var mapData = {'objects': []};
var markers = [];
var coords;

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#trip-planner').toggleClass('active');
    $('#start').val('1901 rock st mountain view')
    $('#end').val('725 san antonio palo alto')
});

// Run these functions after setting geolocation. All except setFormDateTime() are dependent on geolocation to run.
initGeolocation().then(function (coords) {
    map = mapGenerator(coords);
    setDirectionsDisplay(map);
});


function setDirectionsDisplay(map) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
}

function calcRoute() {
    var selectedMode = document.getElementById('mode_travel').value;
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[selectedMode]
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);


            //TODO(zemadi): Look at response to figure out how to add markers into text directions.

            // Box the overview path of the first route
            var distance = .03;
            var path = response.routes[0].overview_path;
            var boxes = rboxer.box(path, distance);

            // Get markers around the route. This is done by getting the boundaries for the route
            // and using those as query params.
            queryResults = getMarkers(response);
            //TODO(zemadi): remove all console.logs.
            console.log(queryResults.objects);
            console.log(boxes);


           // RouteBoxer chops up the user's route into sections.
           // Go through each route path box and filter the query results further.
           // TODO(zemadi): Improve this. Avoid nested loop if possible.
           for (var i = 0; i < boxes.length; i++) {
               var bounds = boxes[i];

               var objectKey = Object.keys(bounds);
               // Using array indices here, because the key changes slightly
               // each time RouteBoxer runs.
               var latBound1 = bounds[objectKey[0]]['k'];
               var latBound2 = bounds[objectKey[0]]['j'];
               var lonBound1 = bounds[objectKey[1]]['k'];
               var lonBound2 = bounds[objectKey[1]]['j'];

               // TODO(zemadi): Add description here of what's going on.
               for (var j = 0; j < queryResults.objects.length; j++) {
                   var currentLat = parseFloat(queryResults.objects[j].lat);
                   var currentLon = parseFloat(queryResults.objects[j].lon)
                   var latArraySort = [currentLat, latBound1, latBound2].sort();
                   var lonArraySort = [currentLon, lonBound1, lonBound2].sort();

                   if (latArraySort.indexOf(currentLat) == 1) {
                       console.log('Got here!');
                       if (lonArraySort.indexOf(currentLon) == 1) {
                        console.log('Got here too!');
                        mapData['objects'].push(queryResults.objects[j]);
                       }
                   }
               }
           }
            // Remove existing markers from the map and map object.
            removeMarkers(true);
            // Once the loop is done, add only route markers on the map
            markerGenerator(map, mapData);
        }
    });

}

function getMarkers(response){
    var queryString = '/api/v1/hazard/?format=json&?order_by=lat';
    var keyByIndex = Object.keys(response.routes[0].bounds);


    // Get the maximum and minimum lat/lon bounds for the route.
    // This will narrow the query to a box around the route.
    var latBound1 = response.routes[0].bounds[keyByIndex[0]]['k'];
    var latBound2 = response.routes[0].bounds[keyByIndex[0]]['j'];
    var lonBound1 = response.routes[0].bounds[keyByIndex[1]]['k'];
    var lonBound2 = response.routes[0].bounds[keyByIndex[1]]['j'];

    //Build the querystring. Negative numbers require different greater/less than logic,
    // so testing for that here.
    if (latBound1 >= 0 && latBound2 >= 0) {
        queryString += '&lat__gte=' + latBound1 + '&lat__lte=' + latBound2;
    } else {
        queryString += '&lat__gte=' + latBound2 + '&lat__lte=' + latBound1;
    }

    if (lonBound1 >= 0 && lonBound2 >= 0) {
        queryString += '&lon__gte=' + lonBound1 + '&lon__lte=' + lonBound2;
    } else {
        queryString += '&lon__gte=' + lonBound2 + '&lon__lte=' + lonBound1;
    }

    // Run the query.
    queryResults = httpGet(queryString);

    return queryResults
}