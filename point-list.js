var NUM_POINTS = 5000;

var goodPoints = [];
var badPoints = [];
var LIST;

function go() {
  var inp = document.getElementById('list').value;
  if (!inp) {
    return;
  }
  try {
    LIST = JSON.parse(inp);
    getNextPoint(LIST);
  } catch (ex) {
    console.error("Error", ex);
    return;
  }
}

function getNextPoint() {
  if (!LIST.length) {
    console.log('done');
    Geo.outputResults(goodPoints);
    return;
  }
  var coord = LIST.splice(0, 1)[0];
  Geo.searchPoint(coord.lat, coord.lng, handleChosenPoint, handleFailedPoint);
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
