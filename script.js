// START OF GEOLOCATION

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
 //get users location and assigns it to empty object created earlier.
 navigator.geolocation.getCurrentPosition(success, error, position => {})
  function success(position) {
    userPosition.lat = position.coords.latitude
    userPosition.lng = position.coords.longitude
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: userPosition })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: userPosition, map: map })
  }
  function error() {
   // The map, centered at user position
   let map = new google.maps.Map(
    document.getElementById('map'), { zoom: 13, center: irvine })
   // The marker, positioned at user position
   let marker = new google.maps.Marker({ position: irvine, map: map })
  }

  // START OF ZOMATO API

  document.getElementById('button').addEventListener('click', event => {
  //prevents page from refreshing when button is clicked
  event.preventDefault()
  // Clear restaurants when searching again
  document.getElementById('row1').innerHTML = '';
  document.getElementById('row2').innerHTML = '';

  // Gets value from the search input
  let searchInput = document.getElementById('searchInput').value;

  // Calls the Zomato Search API and passes in the user's search
  $.ajax({
    type: "GET", //it's a GET request API
    headers: {
      'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a' //only allowed non-standard header
    },
    url: `https://developers.zomato.com/api/v2.1/search?q=${searchInput}&radius=40233&?count=50&lat=${userPosition.lat}&lon=${userPosition.lng}`, //what do you want
    dataType: 'json', //wanted response data type - let jQuery handle the rest...
    data: {
      //could be directly in URL, but this is more pretty, clear and easier to edit 
    },
    processData: true, //data is an object => tells jQuery to construct URL params from it
    success: function (data) {
      console.log(data);

      // Continues to loop through Zomato API and create elements until we have 8 cards on our page
      for (i = 1; document.getElementById('row1').childElementCount + document.getElementById('row2').childElementCount < 8; i++) {

        // Checks if restaurants rating is above 3 stars with less than 40 total ratings
        if (data.restaurants[i].restaurant.user_rating.aggregate_rating > 3 && data.restaurants[i].restaurant.user_rating.votes < 40) {

          // Checks that the div row1 has less than 4 cards, if it has 4 the next 4 cards are added to row 2 with the else statement
          if (document.getElementById('row1').childElementCount < 4) {
          let row = (document.getElementById('row1'));
          let gemElem = document.createElement('DIV');
          row.appendChild(gemElem);          
          gemElem.setAttribute("id", `card${i}`);
          gemElem.classList.add("col", "s12", "m3");
          gemElem.innerHTML = `
            <div class="card z-depth-2" id="restauraunt${i}">
              <div class="card-image">
                <img id="img${i}" src="" alt="restaurant option ${i}">
                <a class="btn-floating halfway-fab waves-effect waves-light red" id="save${i}"><i class="material-icons">add</i></a>
              </div>
              <div class="card-content">
                <span class="card-title" id="title${i}">${data.restaurants[i].restaurant.name}</span>
                <p id="cuisine${i}">${data.restaurants[i].restaurant.cuisines}</p>
                <p id="rating${i}">${data.restaurants[i].restaurant.user_rating.aggregate_rating} (${data.restaurants[i].restaurant.user_rating.votes})</p>
                <p id="address${i}">${data.restaurants[i].restaurant.location.address}</p>
                <a class="waves-effect waves-light btn" href="${data.restaurants[i].restaurant.url}" id="link${i}" target="_blank">Go To Restaurant</a>
              </div>
            </div>
                  `
          } else {
            row = (document.getElementById('row2'));
            gemElem = document.createElement('DIV');
            row.appendChild(gemElem);          
            gemElem.setAttribute("id", `card${i}`);
            gemElem.classList.add("col", "s12", "m3");
            gemElem.innerHTML = `
              <div class="card z-depth-2" id="restauraunt${i}">
                <div class="card-image">
                  <img id="img${i}" src="" alt="restaurant option ${i}">
                  <a class="btn-floating halfway-fab waves-effect waves-light red" id="save${i}"><i class="material-icons">add</i></a>
                </div>
                <div class="card-content">
                  <span class="card-title" id="title${i}">${data.restaurants[i].restaurant.name}</span>
                  <p id="cuisine${i}">${data.restaurants[i].restaurant.cuisines}</p>
                  <p id="rating${i}">${data.restaurants[i].restaurant.user_rating.aggregate_rating} (${data.restaurants[i].restaurant.user_rating.votes})</p>
                  <p id="address${i}">${data.restaurants[i].restaurant.location.address}</p>
                  <a class="waves-effect waves-light btn" href="${data.restaurants[i].restaurant.url}" id="link${i}" target="_blank">Go To Restaurant</a>
                </div>
              </div>`
          }

          // Checks if restaurant has photo or not, if it does sets img source to that, if it doesn't sets img source to placeholder
          if (data.restaurants[i].restaurant.photo_count === 0 || data.restaurants[i].restaurant.thumb === '') {
            document.getElementById(`img${i}`).src = "Assets/placeholder_Green_1000px.png";
          } else {
            document.getElementById(`img${i}`).src = data.restaurants[i].restaurant.photos[0].photo.thumb_url;
          }
          $('#searchInput').value = '';

        }

      }

    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ': ' + xhr.statusText
      alert('Error - ' + errorMessage);
    }
  });

});

// END OF ZOMATO API

}

// END OF GEOLOCATION
