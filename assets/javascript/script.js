document.getElementById('button').addEventListener('click', event => {
  //prevents page from refreshing when button is clicked
  event.preventDefault()

  // Gets value from the search input
  let searchInput = document.getElementById('searchInput').value;

  // Calls the Zomato Search API and passes in the user's search
  $.ajax({
    type: "GET", //it's a GET request API
    headers: {
      'X-Zomato-API-Key': '6cc636d36121906ab8ce98c1468d462a' //only allowed non-standard header
    },
    url: `https://developers.zomato.com/api/v2.1/search?q=${searchInput}&lat=33.669445&lon=-117.823059`, //what do you want
    dataType: 'json', //wanted response data type - let jQuery handle the rest...
    data: {
      //could be directly in URL, but this is more pretty, clear and easier to edit 
    },
    processData: true, //data is an object => tells jQuery to construct URL params from it
    success: function (data) {
      console.log(data);

      for (i = 1; i < 11; i++) {

        if (data.restaurants[i].restaurant.user_rating.aggregate_rating > 2 && data.restaurants[i].restaurant.user_rating.votes < 100) {
          console.log(i);

          let gemElem = document.createElement('div')
          gemElem.className = "card"
          document.getElementById(`place${i}`).innerHTML = `
              <div class="card-image">
              <img id="img${i}" src=""
                alt="${data.restaurants[i].restaurant.name}">
              <span class="card-title">${data.restaurants[i].restaurant.name}</span>
              </div>
                <div class="card-content">
                <a class="halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
                <a class=" halfway-fab waves-effect waves-light red"><i class="material-icons">X</i></a>
                      <p> ${data.restaurants[i].restaurant.location.address}</p>
                      <p>${data.restaurants[i].restaurant.user_rating.aggregate_rating}</p>
                      <p>${data.restaurants[i].restaurant.cuisines}</p>
                      <p> ${data.restaurants[i].restaurant.url}</p>
              </div>
                  `

          if (data.restaurants[i].restaurant.photo_count === 0 || data.restaurants[i].restaurant.thumb === "") {
            document.getElementById(`img${i}`).src = "./assets/images/logo.png";
          } else {
            document.getElementById(`img${i}`).src = data.restaurants[i].restaurant.photos[0].photo.thumb_url;
          }

          //|| data.restaurants[i].restaurant.photos[0].photo.thumb_url === "")

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

      //need a function to replace cards with featured restaurants after user closes the apps
      //document.getElementByClassName('card').innerHTML = 'text and image from featured restaurants'




