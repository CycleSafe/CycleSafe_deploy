var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
$.fn.bootstrapBtn = bootstrapButton            // give $().bootstrapBtn the bootstrap functionality


jQuery(document).ready(function () {

    //jQuery('.crime-request-legend').click(function () {
    //    if (jQuery('#crime-request-region').is(':visible'))
    //        jQuery('#crime-request-region').hide(1500);
    //    else
    //        jQuery('#crime-request-region').show(1500);
    //});



    // form related functions
    var element_name = '';


    element_name = 'crime-type';
    jQuery('.crime-type').click(function () {
        var value = jQuery(this).attr('data-value');
        jQuery('#crime-type-value').val(value);
    });

    element_name = 'witness-type';
    jQuery('.witness-type').click(function () {
        var value = jQuery(this).attr('data-value');
        jQuery('#witness-type-value').val(value);

    });


    jQuery('#report-a-crime').click(function () {
        jQuery(".crime-alert").alert('open');
    });


});

jQuery('.dropdown-toggle').dropdown();


/*
 * Maps related functions
 */

//// Put marker on the map
//function putRandomMarkers(markers) {
//    for (var i = 0; i < markers.length; i++) {
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng(markers[i].x, markers[i].y),
//            map: map,
//            title: "Mugging Incident"
//        });
//    }
//}

////
//$('#reportCrime').click(function (event) {
//    var clicked = $(event.currentTarget);
//    if (clicked.hasClass('report')) {
//        clicked.html('Locating ...');
//        clicked.removeClass('report');
//        clicked.addClass('locate');
//        $('#reportMessage').slideDown();
//    }
//    return false;
//});

//$('#cancelReport').click(function (event) {
//    var button = $('#reportCrime');
//    if (button.hasClass('locate')) {
//        button.html('Report a Crime');
//        button.removeClass('locate');
//        button.addClass('report');
//        $('#reportMessage').slideUp();
//    }
//    return false;
//});
