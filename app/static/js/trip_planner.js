// TODO(zemadi): Add places search to form.

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var rboxer = new RouteBoxer();
var mapData = []
var markers = [];
var coords;
var defaultLat = 37.3394444;
var defaultLon = -121.8938889;

$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#trip-planner').toggleClass('active');
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

            for (var i = 0; i < boxes.length; i++) {
                var bounds = boxes[i];
                var first_key = Object.keys(bounds);

                // Using array indices here, because the key changes slightly
                // each time RouteBoxer runs.
                var latBound1 = bounds[first_key[0]]['k'];
                var latBound2 = bounds[first_key[0]]['j'];
                var lonBound1 = bounds[first_key[1]]['k'];
                var lonBound2 = bounds[first_key[1]]['j'];
                var queryString = '/api/v1/hazard/?format=json'

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
                segmentDataPoints = httpGet(queryString);

                // If values are returned, add them to the map.
                if (segmentDataPoints.objects) {
                    mapData.push.apply(mapData, segmentDataPoints.objects);
                }
            }
            markers = []
            // Once the loop is done, add the markers to the map.
            markerGenerator(map, mapData);
        }
    });

}

////Generate map markers, info windows, and event listeners.
//function markerGenerator(map, mapData) {
//    //Get current data for map.
//    var contentString;
//    var infoWindow = new google.maps.InfoWindow();
//
//    //Add markers to map.
//    for (var i = 0; i < mapData.length; i++) {
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng(mapData[i].lat, mapData[i].lon),
//            map: map,
//            animation: google.maps.Animation.DROP,
//
//            title: mapData[i].description
//
//        });
//        contentString = '<div class="infoindow">' +
//            '<h4><span class="blue">User: </span>' + mapData[i].user_type + '</h4>' +
//            '<p> <span class="blue">Date and Time: </span>' + mapData[i].date_time + '<br>' +
//            '<span class="blue">Hazard: </span>' + mapData[i].hazard_type + '<br>' +
//            '<span class="blue">Description: </span>' + mapData[i].description + '</p>' +
//            '</div>';
//
//        google.maps.event.addListener(marker, 'mouseover', (function (marker, contentString) {
//            return function () {
//                infoWindow.setContent(contentString);
//                infoWindow.open(map, marker);
//            }
//        })(marker, contentString));
//    }
//    //Add marker to map.
//    markers.push(marker);
//
//    return marker;
//}

////Get data from API to generate markers.
//function httpGet(requestUrl) {
//
//    var xmlHttp = new XMLHttpRequest();
//    xmlHttp.open("GET", requestUrl, false);
//    xmlHttp.send(null);
//
//    return JSON.parse(xmlHttp.responseText);
//
//};