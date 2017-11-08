var searched = [];
function findObjectByName(matchProp, obj, path) {
  if (searched.indexOf(obj) != -1) {
    return;
  }
  // console.log('searching', path);
  searched.push(obj);
  for (var prop in obj) {
    if (prop == matchProp) {
      return obj[prop];
    }
    if (prop.indexOf('Sibling') == -1) {
      if (typeof(obj) == 'object' && Object.prototype.toString.call(obj) != '[object Array]') {
        var childObj = findObjectByName(matchProp, obj[prop], path + '.' + prop)
        if (childObj) {
          return childObj;
        }
      }
    }
  }
}

var _map = findObjectByName('_map', window, 'window');
_map.setZoom(14);

var counter = 0;
var TIME_BETWEEN_CLICKS = 250;
function processPoint() {
  if (!coords.length) {
    return;
  }
  var c = coords.splice(0, 1)[0];
  _map.setCenter(new google.maps.LatLng(c.lat, c.lng));
  setTimeout(function() {
    try {
      google.maps.event.trigger(_map, 'click', { latLng: new google.maps.LatLng(c.lat, c.lng) });
      setTimeout(function() {
        var containers = document.body.getElementsByClassName('editor__location-controls');
        if (containers && containers.length) {
          var buttons = containers[0].getElementsByClassName('button');
          if (buttons && buttons.length > 1) {
            buttons[1].click();
            counter++;
            console.log(counter);
          }
          else {
            console.warn("Couldn't find Save Location button");
          }
        }
        else {
          console.warn("Couldn't find editor__location-controls");
        }
        setTimeout(processPoint, TIME_BETWEEN_CLICKS);
      }, TIME_BETWEEN_CLICKS);
    } catch(ex) { }
  }, TIME_BETWEEN_CLICKS);
}

processPoint();
