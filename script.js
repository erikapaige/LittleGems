let userPosition = {
 lat: 0,
 lng: 0
}
let irvine = {
 lat: 33.6694649,
 lng: -117.8231107
}
// Initialize and add the map
function initMap() {
 //
 navigator.geolocation.getCurrentPosition(success, error, options, position => {
  userPosition.lat = position.coords.latitude
  userPosition.lng = position.coords.longitude
  console.log(userPosition.lat)
  console.log(userPosition.lng)

  function success(position) {
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: userPosition })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: userPosition, map: map })
   console.log(irvine)
  }
  
  function error() {
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: irvine })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: irvine, map: map })
   console.log(irvine)
  }

  const options = {
   enableHighAccuracy: true,
   maximumAge: 30000,
   timeout: 27000
  }
  
  //const watchID = navigator.geolocation.watchPosition(success, error, options)
 })
}