(function ($) {
  Drupal.behaviors.annotatorCategories = {
    attach: function (context, settings) {
    var categories_data = Drupal.settings.annotator_categories.result;
    var categories = [];

    //Loops through each category set by the admin and adds it to an array. This array will be used in the file annotator-full-extension-categories.js
     for (var i = 0; i < categories_data.length; i++) {
       //Capitalizes first letter of category at [i]. 
       var category_caps = (categories_data[i].category_name).charAt(0).toUpperCase() + (categories_data[i].category_name).substring(1);
       categories.push({name: category_caps});

  }
    //Adds the array we just created to the Categories plugin, which will use the fields to generate clickable tabs. 
    Drupal.Annotator.annotator('addPlugin', 'Categories', categories);


   }
  };
})(jQuery);