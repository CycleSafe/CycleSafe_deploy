
$(document).ready(function(){ 

	initLocationControls();

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

//    //Set multiple values.
//    document.getElementById('#id_address').setAttribute("value", (lat + ',' + lon));

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