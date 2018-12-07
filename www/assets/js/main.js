
var ltn;
var lgt;
    $('#locationButton').click(function(){
    document.getElementById('map').style.display = "block";
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position); 
            ltn = position.coords.latitude;
            lgt = position.coords.longitude;
            initialize();
                

                
            $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&key=AIzaSyAXSFjyi9xZvkCtCqfdfpuiNUR_vQNns84&sensor=true", function(data) {
                    console.log(data.results[0].address_components[5].long_name);
            });
        });
        
    }

    else{
        console.log('geolocation not supported');
    }
});

    var map;
    var service;
    var infowindow;

    function initialize() {
    var userLocation = new google.maps.LatLng(ltn, lgt);

    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
        });
    
    var request = {
        location: userLocation,
        radius: '5000'
    };

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
    }

    function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
        }
    }
}

function createMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
