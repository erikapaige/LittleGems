let userPosition = {
 lat: 0,
 lng: 0,
}

// Initialize and add the map
function initMap() {
 //
 navigator.geolocation.getCurrentPosition(position => {
  userPosition.lat = position.coords.latitude
  userPosition.lng = position.coords.longitude
  console.log(userPosition.lat)
  console.log(userPosition.lng)
 
 // The map, centered at user position
 let map = new google.maps.Map(
  document.getElementById('map'), { zoom: 13, center: userPosition })
 // The marker, positioned at user position
 let marker = new google.maps.Marker({ position: userPosition, map: map })
 })
}