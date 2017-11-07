var NUM_POINTS = 5000;

var goodPoints = [];
var badPoints = [];

var SELECTED_REGION;

function go() {
  var inp = document.getElementById('polygon').value;
  if (!inp) {
    return;
  }
  try {
    SELECTED_REGION = JSON.parse(inp);
    SELECTED_REGION.polygons.forEach(function(p) {
      p.bounds = Geo.Math.calculateBounds(p.points);
    });
  } catch (ex) {
    console.error("Error", ex);
    return;
  }
  setTimeout(function() {
    getRandomPoint(SELECTED_REGION);
  }, 0);
}

function getRandomPoint(region) {
  var r = Math.floor(Math.random() * region.polygons.length);
  var polygon = region.polygons[r];
  while (true) {
    var lat = Math.random() * (polygon.bounds.maxlat - polygon.bounds.minlat) + polygon.bounds.minlat;
    var lng = Math.random() * (polygon.bounds.maxlng - polygon.bounds.minlng) + polygon.bounds.minlng;
    if (Geo.Math.latLngInsidePolygon(lat, lng, polygon) && Geo.latLngFarFromBadPoints(lat, lng, badPoints) && Geo.latLngFarFromGoodPoints(lat, lng, goodPoints)) {
      Geo.searchPoint(lat, lng, handleChosenPoint, handleFailedPoint);
      break;
    }
  }
}

function handleChosenPoint(lat, lng) {
  if (Geo.latLngFarFromGoodPoints(lat, lng, goodPoints)) {
    goodPoints.push({ lat: lat, lng: lng });
    console.log(goodPoints.length, lat, lng);
    Geo.outputResults(goodPoints);
    Geo.map.setCenter(new google.maps.LatLng(lat, lng));
  }
  else {
    console.warn('panorama location too close to previous point', lat, lng);
  }
  if (goodPoints.length < NUM_POINTS) {
    getRandomPoint(SELECTED_REGION);
  }
  else {
    console.log('done');
    Geo.outputResults(goodPoints);
  }
}

function handleFailedPoint(randLat, randLng) {
  badPoints.push({ lat: randLat, lng: randLng });
  getRandomPoint(SELECTED_REGION);
}
