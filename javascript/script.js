//Global Variables
let rUser = [];
//place holder zip variable
let phZip = [];
//zip to change rUser data to
let mZip = 34112
//Random User API
function ranUsers(){
$.ajax({
  url: 'https://randomuser.me/api/?results=5',
  dataType: 'json',
  async: true,
  success: function(data) {
    // console.log(data);
    // rUser = data;
    var ranUserPull = data;
    rUser = ranUserPull
    // console.log(rUser)
    rUserZip()
  }
});
}  

//Modify rUser to locate data into user's zip



ranUsers()

function rUserZip(){
     
    ///Loop through rUser.results and target postcode
    for ( var i = 0; i < rUser.results.length; i ++)
    //set rUser postcode to value stored in mZip
      rUser.results[i].location.postcode = mZip;
      
}



  //Google Map
  var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      });
    }


//Geolocation
var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
