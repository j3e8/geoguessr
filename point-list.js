var NUM_POINTS = 5000;
var PAUSED = undefined;
var FIND_PANO_WITHIN = 50; // meters

var goodPoints = [];
var badPoints = [];
var LIST;

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
  var inp = document.getElementById('list').value;
  if (!inp) {
    return;
  }
  try {
    LIST = JSON.parse(inp);
  } catch (ex) {
    console.error("Error", ex);
    return;
  }
}

function start() {
  document.getElementById('button').innerText = 'Stop';
  PAUSED = false;
  setTimeout(function() {
    getNextPoint(LIST);
  }, 10);
}

function stop() {
  PAUSED = true;
  document.getElementById('button').innerText = 'Start';
}

function getNextPoint() {
  if (PAUSED) {
    return;
  }
  if (!LIST.length) {
    console.log('done');
    Geo.outputResults(goodPoints);
    return;
  }
  var coord = LIST.splice(0, 1)[0];
  Geo.searchPoint(coord.lat, coord.lng, FIND_PANO_WITHIN, handleChosenPoint, handleFailedPoint);
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
  getNextPoint();
}

function handleFailedPoint(randLat, randLng) {
  badPoints.push({ lat: randLat, lng: randLng });
  getNextPoint();
}
