//Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.database();

//Global Variables
let rUser = {};
//place holder zip variable
let phZip = [];
//zip to change rUser data to
let mZip = 34112
//Random User API
function ranUsers(){
$.ajax({
  url: 'https://randomuser.me/api/?results=5',
  dataType: 'json',
  async: false,
  success: function(data) {
    // console.log(data);
    // rUser = data;
    var ranUserPull = data;
    rUser = ranUserPull
    // console.log(rUser)
    rUserZip()
    rUserFb()
  }
});
}  
ranUsers()
//Modify rUser to change location zip into user's zip
function rUserZip(){
    ///Loop through rUser.results and target postcode
    for ( var i = 0; i < rUser.results.length; i ++)
    //set rUser postcode to value stored in mZip
      rUser.results[i].location.postcode = mZip;
}
// push rUser to firebase db
function rUserFb () {
  //for each user in results array
  //push name, gender, location/zip to firebase
  //variables to declare
    //fname,lname, location, gender, email, dob
  var fName;
  var lname;
  var zip;
  var gender;
  var email;
  var dob;

  for (var i = 0; i < rUser.results.length; i++){
    console.log(rUser)
    fName = rUser.results[i].name.first;
    console.log(rUser.results[0])
    lName = rUser.results[i].name.last;
    zip = rUser.results[i].location.postcode;
    gender = rUser.results[i].gender;
    email = rUser.results[i].email;
    dob = rUser.results[i].dob

  db.ref().push({
    firstName:fName,
    lastName: lName,
    postcode: zip,
    email: email,
    dob: dob,
    gender: gender,
  })
 } 
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
     