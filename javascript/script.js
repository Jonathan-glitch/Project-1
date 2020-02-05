//Random User API
var rUser;
$.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function(data) {
      console.log(data);
      rUser = data
    }
  })

  //Google Map
  function initMap() {
    // The location of Uluru
    var uluru = {lat: -28.5383, lng: 81.3792};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
  }