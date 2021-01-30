// Gets value from the search input
const searchInput = document.getElementById('searchInput').value

// Functions below apply to geoLocation (google map API)
const userPosition = {
  lat: 0,
  lng: 0
}
const irvine = {
  lat: 33.6694649,
  lng: -117.8231107
}
const greenville = {
  lat: 34.852619,
  lng: -82.394012
}

// image error handler, replaces missing images with default placeholder
function imgError(image) {
  console.log(image)
  image.onerror = ''
  image.src = './assets/images/logoreal.png'
  return true
}

function generateRestaurant(r, i) {
  const gemElem = document.createElement('div')
  gemElem.setAttribute('id', `card${i}`)
  gemElem.classList.add('restaurantResult')
  gemElem.style.margin = '20px'

  let photo_url = 'Assets/images/placeholder_1000px.png'
  // Checks if restaurant has photo or not, if it does sets img source to that, if it doesn't sets img source to placeholder
  if (r.photos !== undefined && r.photo_count !== 0) {
    photo_url = r.photos[0].photo.url
  }
  gemElem.innerHTML = `<div class="card z-depth-2" id="restaurant${i}">
              <div class="card-image">
                <img id="img${i}" src="${photo_url}" alt="${r.name}" onerror="imgError(this)">
                <a id="favorite" class="btn-floating halfway-fab waves-effect waves-light red"><i onclick="saveRestaurant()" id="${r.id}" class="material-icons">add</i></a>
              </div>
              <div class="card-content">
                <span class="card-title" id="title${i}">${r.name}</span>
                <p id="cuisine${i}">${r.cuisines}</p>
                <p id="rating${i}">${r.user_rating.aggregate_rating} (${r.user_rating.votes})</p>
                <p id="address${i}">${r.location.address}</p>
                <a class="waves-effect waves-light btn" href="${r.url}" id="link${i}" target="_blank">Go To Restaurant</a>
              </div>
            </div>`
  return gemElem
}

// empty array to later store saved restaurants in local storage
const favoriteArray = []

// collect restaurant's unique ID, stores it in array, and then saves array to local storage
function saveRestaurant() {
  const restaurantID = event.target.id
  favoriteArray.push(restaurantID)
  console.log(restaurantID)
  localStorage.setItem('favoriteArray', JSON.stringify(favoriteArray))
}

// Initialize and add the map
function initMap() {
  function success(position) {
    userPosition.lat = position.coords.latitude
    userPosition.lng = position.coords.longitude
    // The map, centered at user position
    const map = new google.maps.Map(
      document.getElementById('map'), { zoom: 13, center: userPosition })
    // The marker, positioned at user position
    const marker = new google.maps.Marker({ position: userPosition, map: map })
  }
  function error() {
    // Update user position
    userPosition.lat = greenville.lat
    userPosition.lng = greenville.lng
    // The map, centered at user position
    const map = new google.maps.Map(
      document.getElementById('map'), { zoom: 13, center: greenville })
    // The marker, positioned at user position
    const marker = new google.maps.Marker({ position: greenville, map: map })
  }

  // get users location and assigns it to empty object created earlier.
  navigator.geolocation.getCurrentPosition(success, error, position => { })
}

// Retrieve restaurants that match the search criteria
async function getGems() {
  // prevents page from refreshing when button is clicked
  event.preventDefault()

  // Grab references to container
  const rContainer = document.getElementById('resultsContainer')

  // Clear restaurants when searching again
  rContainer.innerHTML = ''

  // Gets value from the search input
  const searchInput = document.getElementById('searchInput').value

  const headers = {
    'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a'
  }
  const url = `https://developers.zomato.com/api/v2.1/search?q=${searchInput}&radius=40233&?count=50&lat=${userPosition.lat}&lon=${userPosition.lng}`

  const data = await fetch(url, { headers: headers }).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      throw Error(res.statusText)
    }
  })

  // Display results
  console.log(data)

  // Filter restaurants
  const rFiltered = data.restaurants
    .filter(r => r.restaurant.user_rating.aggregate_rating > 3 && r.restaurant.user_rating.votes < 40)
    .slice(0, 8)
    .map((r, i) => rContainer.appendChild(generateRestaurant(r.restaurant, i)))
}

async function retrieveSaved() {
  // Grab references to container
  const rContainer = document.getElementById('resultsContainer')

  // Clear restaurants when searching again
  rContainer.innerHTML = ''

  // Retrieve array of favorites
  const favoriteArray = JSON.parse(localStorage.getItem('favoriteArray'))

  // Query restaurant data

  const headers = new Headers({
    'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a'
  })

  // Function that returns a single query promise given a resId
  const queryFunc = (resId) => {
    const url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`
    return fetch(url, { headers: headers }).then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw Error(res.statusText)
      }
    })
  }

  // Send all requests then wait for them to complete
  const restaurants = await Promise.all(favoriteArray.map(queryFunc))

  // Display on page
  restaurants.map((r, i) => rContainer.appendChild(generateRestaurant(r, i)))
}

// Attach Event Handlers
document.getElementById('savedGem').addEventListener('click', retrieveSaved)

function clearInput() {
  document.getElementById('searchInput').value = ''
}

const alert = document.getElementById('alert')

function scrollAlert() {
  alert.textContent = 'Scroll down to see your results!'
}

function fadeAlert() {
  setTimeout(function () { alert.style.display = 'none' }, 3000); return false
}

document.getElementById('button').addEventListener('click', function () {
  if (searchInput.value !== '') {
    getGems()
    clearInput()
    scrollAlert()
    fadeAlert()
  } else {
    console.log('Enter a search!')
  }
})

searchInput.addEventListener('keypress', function (event) {
  const key = event.keyCode
  if (key === 13 && searchInput.value !== '') {
    getGems()
    clearInput()
    scrollAlert()
    fadeAlert()
  }
})
