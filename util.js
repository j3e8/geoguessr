if (!window.Geo) {
  window.Geo = {};
}
Geo.map = null;
Geo.FIND_PANO_WITHIN = 70000; // meters
Geo.TOO_CLOSE_TO_PREVIOUS_BAD_POINT = 100; // meters
Geo.TOO_CLOSE_TO_PREVIOUS_POINT = 1000; // meters
Geo.M_PER_LNG_AT_EQUATOR = 111321.543; // meters

initMap = function() {
  // Create a map object and specify the DOM element for display.
  Geo.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 12
  });
}

Geo.outputResults = function(coords) {
  var str = coords.map(function(g) {
    return '{ "lat":' + g.lat + ', "lng":' + g.lng + '}';
  }).join(',<br>');
  document.getElementById('output').innerHTML = '[<br>' + str + '<br>]';
}

Geo.latLngFarFromBadPoints = function(lat, lng, badPoints) {
  for (var i=0; i < badPoints.length; i++) {
    var sqdist = Geo.Math.getSqDist({ lat: lat, lng: lng }, { lat: badPoints[i].lat, lng: badPoints[i].lng });
    if (sqdist < Geo.TOO_CLOSE_TO_PREVIOUS_BAD_POINT * Geo.TOO_CLOSE_TO_PREVIOUS_BAD_POINT) {
      console.warn('too close to bad point', badPoints[i].lat, badPoints[i].lng);
      return false;
    }
  }
  return true;
}

Geo.latLngFarFromGoodPoints = function(lat, lng, goodPoints) {
  for (var i=0; i < goodPoints.length; i++) {
    var sqdist = Geo.Math.getSqDist({ lat: lat, lng: lng }, { lat: goodPoints[i].lat, lng: goodPoints[i].lng });
    if (sqdist < Geo.TOO_CLOSE_TO_PREVIOUS_POINT * Geo.TOO_CLOSE_TO_PREVIOUS_POINT) {
      console.warn('too close to previous point', goodPoints[i].lat, goodPoints[i].lng);
      return false;
    }
  }
  return true;
}

Geo.checkNearestStreetView = function(randLat, randLng, success, failure, panoData) {
  if (panoData && panoData.copyright && panoData.copyright.toLowerCase().indexOf('google') != -1 && panoData.location && panoData.location.latLng && panoData.links && panoData.links.length > 0) {
    var lat = panoData.location.latLng.lat();
    var lng = panoData.location.latLng.lng();
    success(lat, lng);
  }
  else {
    failure(randLat, randLng);
  }
}

Geo.searchPoint = function(lat, lng, success, failure) {
  var astorPlace = new google.maps.LatLng(lat, lng);
  var webService = new google.maps.StreetViewService();
  var checkaround = Geo.FIND_PANO_WITHIN;
  webService.getPanoramaByLocation(astorPlace, checkaround, Geo.checkNearestStreetView.bind(this, lat, lng, success, failure));
}
