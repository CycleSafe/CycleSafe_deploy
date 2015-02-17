


/*$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#report-hazard').toggleClass('active');
});

// Run these functions after setting geolocation. All except setFormDateTime() are dependent on geolocation to run.
initGeolocation().then(function (coords) {
    map = mapGenerator(coords);
    setFormLatLon(coords[0], coords[1], '#id_lat', '#id_lon');
    setFormListeners();
    setFormDateTime();
});

function setFormDateTime() {
    var localDateTime = new Date();
    var formattedDate = (localDateTime.getMonth() + 1) + '/' + localDateTime.getDate() + '/' + localDateTime.getFullYear() + ' ' + localDateTime.getHours() + ':' + ('0' + localDateTime.getMinutes()).slice(-2);
    $('#id_date_time').val(formattedDate);
}

function setFormListeners() {
    //Click map to change the latitude and longitude in the form.
    google.maps.event.addListener(map, "click", function (event) {
        setFormLatLon(event.latLng.lat(), event.latLng.lng(), '#id_lat', '#id_lon');
    });
}*/