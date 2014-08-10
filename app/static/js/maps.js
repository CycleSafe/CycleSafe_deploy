// This was a homework assignment in the first few weeks of my bootcamp. It shows local weather on a map using GeoLocation (with HTML and libraries needed).

$(document).ready(function(){ 

	initLocationControls();

	addMarkers();
});

function initLocationControls(){
	var geoMessage;

	if (Modernizr.geolocation){
		navigator.geolocation.getCurrentPosition(locationData, locationError);
	} else {
		return false;
	}

}

//If geolocation doesn't work, run an error message.
function locationError(){
	alert('Please enable geolocation to continue.');
	return false;
}

//Collects local data and weather data. 

function locationData(position){
	console.log(position);	
	//Sets variables we'll need to generate other fields.
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var timestamp = position.coords.timestamp;

    mapGenerator(lat, lon);

}

function mapGenerator(lat, lon){
	var mapOptions = {
		center: new google.maps.LatLng(lat, lon),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROAD

	};
	var map = new google.maps.Map(
		document.getElementById("map-canvas"),
		mapOptions);


//Need to pull marker data and set it to something.
//google.maps.event.addListener(marker, 'click', function() {
//	infowindow.open(map,marker)
//});
//
}