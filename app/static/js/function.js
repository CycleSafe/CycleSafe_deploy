/**
 * Created by zhilabug on 6/9/14.
 *//*


var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
$.fn.bootstrapBtn = bootstrapButton            // give $().bootstrapBtn the bootstrap functionality


jQuery(document).ready(function () {

   var element_name = '';


    element_name = 'hazard-type';
    jQuery('.hazard-type').click(function () {
        var value = jQuery(this).attr('data-value');
        jQuery('#hazard-type-value').val(value);
    });

    element_name = 'witness-type';
    jQuery('.witness-type').click(function () {
        var value = jQuery(this).attr('data-value');
        jQuery('#witness-type-value').val(value);

    });


    jQuery('#report-a-hazard').click(function () {
        jQuery(".hazard-alert").alert('open');
    });


});

jQuery('.dropdown-toggle').dropdown();*/
