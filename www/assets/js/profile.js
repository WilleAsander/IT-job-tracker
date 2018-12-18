$(document).ready(detailsGenerate());

function goToProfile(){
    $.ajax({
        method: 'GET',
        url: '../../api/profile',
        success: function(result){
            goToAuthenticationProfile(result);
        }
    });
}

function goToAuthenticationProfile(token){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        url: '../../api/profile/authenticate',
        success: function(result){
            window.location.href = result.url;
            
            

        }

    });
}

function detailsGenerate(f, l, e, d){
    $.ajax({
        method: 'GET',
        url: '../../api/profile/details',
        success: function(result){
            $('#firstName').append("Namn: " + result.firstName + " " + result.lastName);
            $('#email').append("Mailaddress: " + result.email);
        }
    });
    
}
function goToAbout(){
    $.ajax({
        method: 'GET',
        url: '../../api/about',
        success: function(result){
            goToAuthenticationAbout(result);
        }
    });
}

function goToAuthenticationAbout(token){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        url: '../../api/about/authenticate',
        success: function(result){
            window.location.href = result.url;
        }

    });
}