$.ready(ConnectAfApi());
//Connects to the AF-API
function ConnectAfApi() {
    $.ajax({
        type: 'GET',
        url: 'http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan',
        log: url,
        success: function(list) {
            var jobs = list;
            
        }
    });
    
}
       
