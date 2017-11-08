var map;
var lastPolygon;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 6
  });

  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon']
    }
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(map, 'click', function(event) {
    if (lastPolygon) {
      lastPolygon.setMap(null);
    }
  });

  google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
    lastPolygon = polygon;
    var data = polygon.getPath().getArray();
    var points = [];
    data.forEach(function(d) {
      var lat = d.lat();
      var lng = d.lng();
      points.push({ lat: lat, lng: lng });
    });

    var output = document.getElementById('output');
    if (output) {
      output.innerHTML = '{<br>  "points": [<br>' + points.map(function(pt) {
        return '    { "lat": ' + pt.lat + ', "lng": ' + pt.lng + ' }';
      }).join(',<br>') + "<br>  ]<br>}";
    }
  });
}
