if (!window.Geo) {
  window.Geo = {};
}
Geo.Math = {};

Geo.Math.calculateBounds = function(points) {
  var minlat, maxlat, minlng, maxlng;
  points.forEach(function(pt) {
    if (!minlat || pt.lat < minlat) minlat = pt.lat;
    if (!maxlat || pt.lat > maxlat) maxlat = pt.lat;
    if (!minlng || pt.lng < minlng) minlng = pt.lng;
    if (!maxlng || pt.lng > maxlng) maxlng = pt.lng;
  });
  return {
    minlat: minlat,
    maxlat: maxlat,
    minlng: minlng,
    maxlng: maxlng
  }
}

Geo.Math.latLngInsidePolygon = function(lat, lng, polygon) {
  var testLine = {
    start: { x: lng, y: lat },
    end: { x: 0, y: 0 }
  }
  var crosses = 0;
  for (var i=0; i < polygon.points.length; i++) {
    var a = polygon.points[i];
    var b = i < polygon.points.length - 1 ? polygon.points[i + 1] : polygon.points[0];
    var line = {
      start: { x: a.lng, y: a.lat },
      end: { x: b.lng, y: b.lat }
    }
    if (Geo.Math.doLinesCross(line, testLine)) {
      crosses++;
    }
  }
  return crosses % 2 == 1 ? true : false;
}

Geo.Math.doLinesCross = function(a, b) {
  var am = (a.end.y - a.start.y) / (a.end.x - a.start.x);
  var ab = a.end.y - am * a.end.x;
  var bm = (b.end.y - b.start.y) / (b.end.x - b.start.x);
  var bb = b.end.y - bm * b.end.x;
  if (am - bm == 0) {
    return false;
  }
  var x = (bb - ab) / (am - bm);
  var y = am * x + ab;
  if (x >= Math.min(a.start.x, a.end.x) && x <= Math.max(a.start.x, a.end.x) && y >= Math.min(a.start.y, a.end.y) && y <= Math.max(a.start.y, a.end.y)
    && x >= Math.min(b.start.x, b.end.x) && x <= Math.max(b.start.x, b.end.x) && y >= Math.min(b.start.y, b.end.y) && y <= Math.max(b.start.y, b.end.y)) {
    return true;
  }
  return false;
}

Geo.Math.getSqDist = function(a, b) {
  var M_PER_LAT = 111125;
  var M_PER_LNG = Math.cos(a.lat / 180 * Math.PI) * Geo.M_PER_LNG_AT_EQUATOR;
  var latdiff = (b.lat - a.lat) * M_PER_LAT;
  var lngdiff = (b.lng - a.lng) * M_PER_LNG;
  var sqdist = latdiff * latdiff + lngdiff * lngdiff;
  return sqdist;
}
