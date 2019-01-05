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
var jobWage;
var linkID;
var jobPlats;
var jobType;
var jobLenght;
var jobEmail;
var jobRegisterday;
var link;
var markers = [];
var markerCoor;
var userMarker;
var userName;
var userEmail;
var radius;



$(document).ready(getDistance());
function getDistance(){
    $.ajax({
        method: 'GET',
        url: 'distance',
        success: function(result){
            getDistanceDecode(result);
        }
    });
};

function getDistanceDecode(token){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        url: 'distance/decode',
        success: function(result){
            userName = result.name;
            userEmail = result.email;
            map();
        }
    });
}

//=========================================================================GET YOUR LOCATION===========================================================================================
//function to start on click of a button
function map(){
    //find users current location
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
                createMap(userURL);
            });


        });

    }
    //error message if geolocation isnt supported in browser
    else {
        console.log('geolocation not supported');
    }
}

function createMap(URL){
    var userLocation = new google.maps.LatLng(ltn, lgt);
    map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
    });
    radius = new google.maps.Circle({
        strokeColor: '#00FF7F',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FA9A',
        fillOpacity: 0.35,
        center: userLocation,
        radius: 5000,
        draggable: true,
        geodesic: true,
        map: map
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var mobileInput = document.getElementById('mobileSearch');
    var mobileSearchBox = new google.maps.places.SearchBox(mobileInput);
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(mobileInput);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    map.addListener('bounds_changed', function() {
        mobileSearchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
      
        if (places.length == 0) {
          return;
        }

          // For each place, get the icon, name and location.
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }

            // Create a marker for each place.
            userLocation = place.geometry.location;
          });
          userMarker = new google.maps.Marker({
            position: userLocation,
            icon: userIcon,
            zIndex: 100,
            map: map
        });
        map.setCenter(userLocation);
        radius.setMap(null);
        radius = new google.maps.Circle({
            strokeColor: '#00FF7F',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FA9A',
            fillOpacity: 0.35,
            center: userLocation,
            radius: 5000,
            draggable: true,
            geodesic: true,
            map: map
        });
        
        google.maps.event.addListener(radius, 'dragend', function(){
            userLocation = radius.getCenter();
            userMarker = new google.maps.Marker({
                position: userLocation,
                icon: userIcon,
                zIndex: 100,
                map: map
            });
            for(i=0; i<markers.length; i++){
                markers[i].setMap(null);
            }
            markers.push(userMarker);
            getNewPosition(userLocation.lat(), userLocation.lng(), radius);
            
        });
        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        markers.push(userMarker);
        getNewPosition(userLocation.lat(), userLocation.lng(), radius);
        });

        
        getAmmount(URL, radius);
    
    userLocation = radius.getCenter();
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
    markers.push(userMarker);
    google.maps.event.addListener(radius, 'dragend', function(){
        userLocation = radius.getCenter();
        userMarker = new google.maps.Marker({
            position: userLocation,
            icon: userIcon,
            zIndex: 100,
            map: map
        });
        for(i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        markers.push(userMarker);
        getNewPosition(userLocation.lat(), userLocation.lng(), radius);
        
    });
    getAmmount(URL, radius);


}

function getNewPosition(userLtn, userLgt, radius){

    ltn = userLtn;
    lgt = userLgt;
    //Get additional details about users location from google API  
        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLtn + "," + userLgt + "&key=AIzaSyAXSFjyi9xZvkCtCqfdfpuiNUR_vQNns84&sensor=true", function (data) {
            //get the region I.e skogås, stockholm ect. And also get users zip code.
            userRegion = data.results[0].address_components[2].long_name;
            userZip = data.results[0].address_components[5].long_name;
            //remove the space and last two numbers in zip code
            userZip = userZip.slice(0, -3);
            //merge the new zip code and region to create the necessary url component for the AF API
            userURL = userZip + "+" + userRegion;
            //send the component to a function
            getAmmount(userURL, radius);
        }); 
}

//===================================================================================GET JOBS==================================================================================================
function getAmmount(URL, radius) {
    //for testing purposes since there was no IT jobs avalible at our current location. Remove to get your URL back
    $.ajax({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv'
        },
        //The API with the URL component and the id of IT-jobs from AF API
        url: 'https://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=' + URL + '&yrkesomradeid=3&antalrader=1000',
        success: function (result) {
            if(result.matchningslista.antal_platsannonser == 0){
                noResults();
                
            }
            //A loop that goes through all jobs and send the id of the job to a function
            else{
                for (var i = 0; i < result.matchningslista.matchningdata.length; i++) {
                    var annonsId = result.matchningslista.matchningdata[i].annonsid;
                    getJobDetails(annonsId, radius);
                }
            }



        }
    });
}

function noResults(){
    if ($(".modal")[0]){
        $('.modal').modal('show');
    }
    else{
        $('body').append(
            $('<div class="modal fade" tabindex="-1" role="dialog" id="modal">').append(
                $('<div class="modal-dialog" role="document">').append(
                    $('<div class="modal-header">').append(
                        $('<h5 class="modal-title">').text('Inga resultat hittades!'),
                        $('<button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick="closeModal()">').append(
                            $('<i class="fas fa-times">')
                        )
                    ),
                    $('<div class="modal-body">').append(
                        $('<p>').text('Det verkar inte finnas några jobb på denna plats just nu!')
                    )
                )
            )
        );
        $('.modal').modal('show');
    }

    $('.modal-dialog').css('background-color', 'white');
}

function closeModal(){
    $('.modal').modal('hide');
    
}


function getJobDetails(annonsId, radius) {
    $.ajax({
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv'
        },
        //API with the job ID
        url: 'https://api.arbetsformedlingen.se/af/v0/platsannonser/' + annonsId,
        success: function (result) {
            //Get the address and jobName and send to the next function
            address = result.platsannons.arbetsplats.besoksadress;
            jobName = result.platsannons.annons.yrkesbenamning;
            jobPlats= result.platsannons.arbetsplats.arbetsplatsnamn;
            jobType = result.platsannons.villkor.arbetstid;
            jobEmail = result.platsannons.arbetsplats.epostadress;
            jobLenght = result.platsannons.villkor.varaktighet;
            jobRegisterday = result.platsannons.ansokan.sista_ansokningsdag;
            jobWage = result.platsannons.villkor.lonetyp;
            linkID = result.platsannons.annons.annonsid;
            link = "https://www.arbetsformedlingen.se/For-arbetssokande/Hitta-jobb/Platsbanken/annonser/" + linkID;
            initialize(address, jobName, jobPlats,jobType,jobEmail,jobLenght,jobRegisterday,jobWage,linkID,link, radius);
            



        }
    });
}

//=========================================infobox about jobs================================================

function hide(target) {
    document.getElementById(target).style.display = 'none';
}

//========================================================================MAP CREATION FUNCTON============================================================

function initialize(address, jobName,jobPlats,jobType,jobEmail, jobLenght, jobRegisterday, jobWage,link, linkID, radius) {
    //get our location(right now its coordinates for stockholm for testing purposes, in the future they will be switched with variables ltn and lgt)
    var userLocation = new google.maps.LatLng(ltn, lgt);
    //create the infowindow for displaying info about the location of the marker
    infowindow = new google.maps.InfoWindow();
    //initialize geocoder
    geocoder = new google.maps.Geocoder();
    //create a user marker based on user location
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
                            animation: google.maps.Animation.DROP,
                            map: map
                        });
                        markers.push(marker);
                        for(var i = 0; i < markers.length-1; i++){
                            if (markers[i].getPosition().lat() == marker.getPosition().lat() && markers[i].getPosition().lng() == marker.getPosition().lng()){
                                marker.setMap(null);
                            }
                        }
                        marker.addListener('click', toggleBounce);
                        google.maps.event.addListener(marker, 'click', (function (marker) {
                            return function () {
                                    //$('#infobox').css('display', 'none');
                                    //
                                    if($('#infobox').is(':visible')){
                                        toggle();
                                    }
                                    else{
                                    show(); 
                                    }

                                    document.getElementById('infobox').innerHTML = 
                                    '<button type="button" class="close bg-light" id="closebox" onclick ="hide()">X</button>' +
                                    '<div><h3 class="jobdetail">Detaljer om jobbet</h3>' +
                                    '<div class="jobdetail"><span class="font-weight-bold">Annonsnamn: </span>' + jobName + '</div>' +
                                    '<div class="jobdetail"><span class="font-weight-bold"> Jobbadress: </span>' + address +  '</div>' +
                                    '<div class="jobdetail"><span class="font-weight-bold"> Anställningsform: </span>' + jobType +'</div>' +
                                    '<div class="jobdetail"><span class="font-weight-bold"> Varaktighet: </span>' + jobLenght +'</div>' +
                                    '<div class="jobdetail"><span class="font-weight-bold">Lön: </span>' + jobWage + '</div>' +
                                    '<div class="jobdetail"><span class="font-weight-bold"><form action="https://www.arbetsformedlingen.se/For-arbetssokande/Hitta-jobb/Platsbanken/annonser/'+link+'"><button id="mail">Mer info</button></form>' + '</div>' +
                                    '</div>';
                                    
                                    
                                
                                                        
                            }
                        })(marker));
                    
                }
                
            



            //an event that makes the infowindow pop up after marker is clicked
            
        }
    });
    
}

function toggleBounce() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
      this.setAnimation(google.maps.Animation.BOUNCE);
}

function show(){
    if($('#mobile-indicator').is(':visible')){
            $('#infobox').animate({
                opacity: 1,
                height: "show"
            });
        }
        else{
                $('#infobox').animate({
                    opacity: 1,
                    width: "show"
                });
        }
}


function hide(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
    if($('#mobile-indicator').is(':visible')){
            $("#infobox").animate({
                opacity: 1,
                height: "hide"
            });
    }
    else{
            $('#infobox').animate({
                opacity: 1,
                width: "hide"
            });
        
    }
}

function toggle(callback){
    if($('#mobile-indicator').is(':visible')){
        $("#infobox").animate({
            opacity: 1,
            height: "toggle"
        });
        $("#infobox").animate({
            opacity: 1,
            height: "toggle"
        });
    }
    else{

        $("#infobox").animate({
            opacity: 1,
            width: "toggle"
        });

        $("#infobox").animate({
            opacity: 1,
            width: "toggle"
        });
    }
}

function goToHome(){
    $.ajax({
        method: 'GET',
        url: '../../api/map/token',
        success: function(result){
            goToAuthenticationHome(result);
        }
    });
}

function goToAuthenticationHome(token){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        url: '../../api/map',
        success: function(result){
            window.location.href = result;
            
            

        }

    });
}