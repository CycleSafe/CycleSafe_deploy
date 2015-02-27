// p = MV
// M = V/p

// h = m /  pA

var mass_ice = 29349;
var volume_ice_sheet = 27000000;
var density_ice = 919.9632;
var area_ocean = 360000000;

var h = mass_ice / (density_ice * area_ocean);

console.log(h);