//Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.database();

//Global Variables
let rUser = {};
//place holder zip variable
let phZip = [];
//zip to change rUser data to
let mZip;

let isLocated = false;

let sdv;
//Random User API
function ranUsers(){
$.ajax({
  url: 'https://randomuser.me/api/?results=5',
  dataType: 'json',
  async: false,
  success: function(data) {
    console.log(data);
    // rUser = data;
    var ranUserPull = data;
    rUser = ranUserPull
    // console.log(rUser)
    rUserZip()
    locateUser()
    rUserFb()
  }
});
}  

//Modify rUser to change location zip into user's zip
function rUserZip(){
    ///Loop through rUser.results and target postcode
    for ( var i = 0; i < rUser.results.length; i ++){
    //set rUser postcode to value stored in mZip
      rUser.results[i].location.postcode = mZip;
      }
}
// push rUser to firebase db
function rUserFb () {
  //for each user in results array
  //push name, gender, location/zip to firebase
  //variables to declare
    //fname,lname, location, gender, email, dob
  var fName;
  var lName;
  var zip;
  var gender;
  var email;
  var dob;
  var pic;

  for (var i = 0; i < rUser.results.length; i++){
    // console.log(rUser)
    fName = rUser.results[i].name.first;
    // console.log(rUser.results[0])
    lName = rUser.results[i].name.last;
    zip = rUser.results[i].location.postcode;
    gender = rUser.results[i].gender;
    email = rUser.results[i].email;
    dob = rUser.results[i].dob;
    pic = rUser.results[i].picture.medium
  db.ref().push({
    firstName:fName,
    lastName: lName,
    postcode: zip,
    email: email,
    dob: dob,
    gender: gender,
    picture: pic,
  })
 } 
}
//Grab user data and push to firebase db

function uForm (){
  //on click function targeting submit button 
  $("#submit").on("click", function(event){
    //prevent default
    event.preventDefault()
      console.log("Here")
      var formData = {//create variables for form input fields
        fN: $("#firstName").val().trim(),
        lN: $("#lastName").val().trim(),
        // gender: $("#gender").val().trim(),
        //birthday???
        // uName: $("#username").val().trim(),
        // pW: $("#password").val().trim(),
        city: $("#city").val().trim(),
        // state:$("#state").val().trim(),
        zip: $("#zip").val().trim(),
        tac: $("#invalidCheck2").val().trim(),
      }
      console.log(formData)
      var formArray = Object.values(formData)
      console.log(formArray)
        //create if statement to check all fields have been filled out
        for (var i = 0; i < formArray.length;i ++){
          if ($(formArray[i]) === ''){
            console.log("Please fill in all fields")
            console.log(formArray[i])}
        }
        //push user form data to firebase db
        db.ref().push({
          firstName: formData.fN,
          lastName: formData.lN,
          city: formData.city,
          postcode: formData.zip,
          // email: email,
          // dob: dob,
          tac: formData.tac
        })
        

        //clear user form
        $(formData.fn).val('');
        $(formData.lN).val('');
        $(formData.city).val('');
        $(formData.zip).val('');
        $(formData.tac).val('');
        
    })  

  }

  //check if zip code has loaded from geoCode and set isLocated to true if user is located by zip
  function locateUser(){

    if (mZip !== 0){
      isLocated = true;
    } else {
      return
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
          zoom: 10
        });
        // placing marker on map based on user location
        // var myLatLng = {lat:,lng: }
        

        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var geoEndPoint = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +pos.lat +","+pos.lng+"&key=" + rogerKey;
            $.ajax({
              url:geoEndPoint,
              method:"get" 
            }).then(
              function(res){
                console.log(res.results[0]);
                mZip = res.results[0].address_components[7].short_name/*.formatted_address)*/;
                ranUsers()
                db.ref().orderByChild("postcode").equalTo(mZip).on("child_added", function(snapshot) {
                  // console.log(snapshot.val());
                  var dv = snapshot.val()
                  //push results to HTML
                  // console.log(dv)
                  
                  //   console.log("here")
                    var uN = dv.firstName;
                    var uL = dv.lastName;
                    var uG = dv.gender; 
                    var uE = dv.email;
                    var uA = dv.dob.age;
                    var pic = dv.picture

                    var card = $("<div class='card px-3'><div class='card-header'>" + uN +" " + uL + " | " + uE + "</div><div class='card-body'><div class='card-title'><form><div class='row'><div class='col-md-4'><img src=" + pic + "><p class='card-text'>" + uN + uL + "<br>"+ uG + "<br>"+ uA + "<br>"+ uE + "</p><div class='row'><div class='form-group col'></div></div></fieldset></div></div></form><br><a href='#' class='btn btn-primary btn-lg'>Email</a></div></div>");
                    // var cBody = $('<div class="card-body">')
                    
                    $(".results").append(card)
                    // $(".card").appendChild(cBody)

                })
              }
            );

            var marker = new google.maps.Marker({
                      position: pos,
                      map: map,
                      title: 'Hello World!'
                    });
                    

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
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
      
uForm()

