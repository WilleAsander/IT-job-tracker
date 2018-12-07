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

//=========================================================================GET YOUR LOCATION===========================================================================================
//function to start on click of a button
$('#locationButton').click(function(){
    //find users current location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){ 
            //Users coordinates
            ltn = position.coords.latitude;
            lgt = position.coords.longitude;
                

            //Get additional details about users location from google API    
            $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&key=AIzaSyAXSFjyi9xZvkCtCqfdfpuiNUR_vQNns84&sensor=true", function(data) {
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
    else{
        console.log('geolocation not supported');
    }
});

//===================================================================================GET JOBS==================================================================================================
function getAmmount(URL){
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
        success: function(result){
            //A loop that goes through all jobs and send the id of the job to a function
            for(var i = 0; i < result.matchningslista.matchningdata.length; i++){
                var annonsId = result.matchningslista.matchningdata[i].annonsid;
                getJobDetails(annonsId);
            }
            
            
            
        }
    });
}


function getJobDetails(annonsId){
    $.ajax({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv' 
        },
        //API with the job ID
        url: 'http://api.arbetsformedlingen.se/af/v0/platsannonser/' + annonsId,
        success: function(result){
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
    //create the infowindow for displaying info about the location of the marker
    infowindow = new google.maps.InfoWindow();
    //initialize geocoder
    geocoder = new google.maps.Geocoder();
    //get the coordinates for the address
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
            markerLtn = results[0].geometry.location.lat;
            markerLgn = results[0].geometry.location.lng;
            //create the marker based of coordinates
            marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map
            });

            //an event that makes the infowindow pop up after marker is clicked
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                infowindow.setContent(jobName);
                infowindow.open(map, marker);
                }
            })(marker));
        }
      });
      

}