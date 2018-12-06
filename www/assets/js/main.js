$('#locationButton').click(function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            console.log(position); 
            $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&key=AIzaSyAXSFjyi9xZvkCtCqfdfpuiNUR_vQNns84&sensor=true", function(data) {
                    console.log(data);
            });
        });
        
    }

    else{
        console.log('geolocation not supported');
    }
});