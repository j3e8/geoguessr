var NUM_POINTS = 1;
var PAUSED = undefined;
var FIND_PANO_WITHIN = 70000; // meters

var goodPoints = [];
var badPoints = [];

var SELECTED_REGION;

function go() {
  if (PAUSED === undefined) {
    init();
    start();
  }
  else if (PAUSED) {
    start();
  }
  else {
    stop();
  }
}

function init() {
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
  NUM_POINTS = document.getElementById('num_points').value;
}

function start() {
  document.getElementById('button').innerText = 'Stop';
  PAUSED = false;
  setTimeout(function() {
    getRandomPoint(SELECTED_REGION);
  }, 10);
}

function stop() {
  PAUSED = true;
  document.getElementById('button').innerText = 'Start';
}

function getRandomPoint(region) {
  if (PAUSED) {
    return;
  }
  var r = Math.floor(Math.random() * region.polygons.length);
  var polygon = region.polygons[r];
  while (true) {
    var lat = Math.random() * (polygon.bounds.maxlat - polygon.bounds.minlat) + polygon.bounds.minlat;
    var lng = Math.random() * (polygon.bounds.maxlng - polygon.bounds.minlng) + polygon.bounds.minlng;
    if (Geo.Math.latLngInsidePolygon(lat, lng, polygon) && Geo.latLngFarFromBadPoints(lat, lng, badPoints) && Geo.latLngFarFromGoodPoints(lat, lng, goodPoints)) {
      Geo.searchPoint(lat, lng, FIND_PANO_WITHIN, handleChosenPoint.bind(this, polygon), handleFailedPoint);
      break;
    }
  }
}

function handleChosenPoint(polygon, lat, lng) {
  if (Geo.Math.latLngInsidePolygon(lat, lng, polygon) && Geo.latLngFarFromGoodPoints(lat, lng, goodPoints)) {
    goodPoints.push({ lat: lat, lng: lng });
    // console.log(goodPoints.length, lat, lng);
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
