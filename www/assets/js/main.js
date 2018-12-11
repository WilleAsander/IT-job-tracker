//global variabels
var map;
var service;
var infowindow;
var markerLtn;
var markerLgn;
var geocode;
var marker;
var ltn;
var lgt;
var userZip;
var userRegion;
var userURL;
var userLocal;
var address;
var jobName;
var markers = [];
var markerCoor;
var userMarker;

//=========================================================================GET YOUR LOCATION===========================================================================================
//function to start on click of a button
$('#locationButton').click(function () {
    //find users current location
    document.getElementById('map').style.display = "block";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            //Users coordinates
            ltn = position.coords.latitude;
            lgt = position.coords.longitude;


            //Get additional details about users location from google API    
            $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyAXSFjyi9xZvkCtCqfdfpuiNUR_vQNns84&sensor=true", function (data) {
                //get the region I.e skogås, stockholm ect. And also get users zip code.
                userRegion = data.results[0].address_components[2].long_name;
                userZip = data.results[0].address_components[5].long_name;
                //remove the space and last two numbers in zip code
                userZip = userZip.slice(0, -3);
                //merge the new zip code and region to create the necessary url component for the AF API
                userURL = userZip + "+" + userRegion;
                //send the component to a function
                getAmmount(userURL);;
            });


        });

    }
    //error message if geolocation isnt supported in browser
    else {
        console.log('geolocation not supported');
    }
});

//===================================================================================GET JOBS==================================================================================================
function getAmmount(URL) {
    //for testing purposes since there was no IT jobs avalible at our current location. Remove to get your URL back
    URL = "stockholm";
    $.ajax({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv'
        },
        //The API with the URL component and the id of IT-jobs from AF API
        url: 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=' + URL + '&yrkesomradeid=3',
        success: function (result) {
            //A loop that goes through all jobs and send the id of the job to a function
            for (var i = 0; i < result.matchningslista.matchningdata.length; i++) {
                var annonsId = result.matchningslista.matchningdata[i].annonsid;
                getJobDetails(annonsId);
            }



        }
    });
}


function getJobDetails(annonsId) {
    $.ajax({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv'
        },
        //API with the job ID
        url: 'http://api.arbetsformedlingen.se/af/v0/platsannonser/' + annonsId,
        success: function (result) {
            //Get the address and jobName and send to the next function
            address = result.platsannons.arbetsplats.besoksadress;
            jobName = result.platsannons.annons.yrkesbenamning;
            initialize(address, jobName);



        }
    });
}



//========================================================================MAP CREATION FUNCTON============================================================

function initialize(address, jobName) {
    //get our location(right now its coordinates for stockholm for testing purposes, in the future they will be switched with variables ltn and lgt)
    var userLocation = new google.maps.LatLng(59.3293, 18.0686);
    //create a map with our location as the center
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
    });
    //draw radius circle(pure aestetics and don't have any feature)
    var radius = new google.maps.Circle({
        strokeColor: '#00FF7F',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FA9A',
        fillOpacity: 0.35,
        center: userLocation,
        radius: 5000,
        clickable: false,
        map: map
    });
    //create the infowindow for displaying info about the location of the marker
    infowindow = new google.maps.InfoWindow();
    //initialize geocoder
    geocoder = new google.maps.Geocoder();
    //create a user marker based on user location
    var userIcon = {
        url: 'https://img.icons8.com/color/50/000000/user-location.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
      };
    userMarker = new google.maps.Marker({
        position: userLocation,
        icon: userIcon,
        zIndex: 100,
        map: map
    });
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //get the coordinates for the address
            markerLtn = results[0].geometry.location.lat;
            markerLgn = results[0].geometry.location.lng;
            if (radius) map.fitBounds(radius.getBounds());
            //create the marker based of coordinates and if they fall into radius
            var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(userLocation, results[0].geometry.location);
            if (distance_from_location <= 5000) {
                marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                });
            }



            //an event that makes the infowindow pop up after marker is clicked
            google.maps.event.addListener(marker, 'click', (function (marker) {
                return function () {
                    infowindow.setContent(jobName);
                    infowindow.open(map, marker);
                }
            })(marker));
        }
    });
}
