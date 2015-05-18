$(document).ready(function () {
    $('.active').toggleClass('active');
    $('#dashboard').toggleClass('active');
});

// Run these functions after setting geolocation. All except setFormDateTime() are dependent on geolocation to run.
initGeolocation().then(function (coords) {
    map = mapGenerator(coords);
    searchBoxGenerator('#pac-input', true);
});