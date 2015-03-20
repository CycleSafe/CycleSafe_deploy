// Helpers for Handlebars.

// Return loop index + 1. Useful for a counter.
Handlebars.registerHelper("count", function(value, options)
{
    return parseInt(value) + 1;
});

// Escape string HTML, used by Google Maps Directions API.
Handlebars.registerHelper('strip-scripts', function(context) {
      var html = context;
      return new Handlebars.SafeString(html);
    });