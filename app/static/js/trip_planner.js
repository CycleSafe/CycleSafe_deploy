var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var rboxer = new RouteBoxer();
var mapData = []
var markers = [];

$(document).ready(function () {
    launchMap();

});

function launchMap() {
    initialize();
    google.maps.event.addDomListener(window, 'load', initialize);
}

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
        zoom:7,
        center: chicago
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            // Box the overview path of the first route
            var distance = .01;
            var path = response.routes[0].overview_path;
            var boxes = rboxer.box(path, distance);

            for (var i = 0; i < boxes.length; i++) {
                var bounds = boxes[i];
                var latBound1 = bounds.Ea.k;
                var latBound2 = bounds.Ea.j;
                var lonBound1 = bounds.wa.k;
                var lonBound2 = bounds.wa.j;
                //TODO(zemadi): Remove host name.
                var queryString = 'http://127.0.0.1:8000/api/v1/hazard/?format=json'

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
        }
    });
    markerGenerator(map, mapData);
}

//TODO(zemadi): Similar code to report_map.js consolidate and standardize this.
//Generate map markers, info windows, and event listeners.
function markerGenerator(map, mapData) {
    //Get current data for map.
    var contentString;
    var infoWindow = new google.maps.InfoWindow();

    //Add markers to map.
    for (var i = 0; i < mapData.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapData[i].lat, mapData[i].lon),
            map: map,
            animation: google.maps.Animation.DROP,

            title: mapData[i].description

        });
        contentString = '<div class="infoindow">' +
            '<h4><span class="blue">User: </span>' + mapData[i].user_type + '</h4>' +
            '<p> <span class="blue">Date and Time: </span>' + mapData[i].date_time + '<br>' +
            '<span class="blue">Hazard: </span>' + mapData[i].hazard_type + '<br>' +
            '<span class="blue">Description: </span>' + mapData[i].description + '</p>' +
            '</div>';

        google.maps.event.addListener(marker, 'mouseover', (function(marker, contentString) {
            return function() {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, contentString));
    }
    //Add marker to map.
    markers.push(marker);

    return marker;
}

//TODO(zemadi): This function is also used in report_map.js. Create a common js file.
//Get data from API to generate markers.
function httpGet(requestUrl) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestUrl, false);
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText);

};