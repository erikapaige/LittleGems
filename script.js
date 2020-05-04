let lat = 0
let lon = 0

navigator.geolocation.getCurrentPosition(position => {
 let lat = position.coords.latitude
 let lon = position.coords.longitude
 console.log(lat)
 console.log(lon)
})

// fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=2260330a175994e3a7136d694876386f`)
//  .then(displayWeather => {

//  })