var firstName;
var lastName;
var email;
var password;
var distance;
var userData = [];
var token = '';

$.ready(loginPageInit());

function loginPageInit(){
    $('.wrapper').css('display', 'flex');
}

function changeToRegistrationForm(){
    $('#errorText').remove();
    $('form').empty();
    $('form').append(
        $('<input type="text" id="fName" class="fadeIn second" name="login" placeholder="firstname">').val(firstName),
        $('<input type="text" id="lName" class="fadeIn third" name="login" placeholder="lastname">').val(lastName),
        $('<input type="text" id="email" class="fadeIn fourth" name="login" placeholder="email">').val(email),
        $('<input type="password" id="password" class="fadeIn fifth" name="login" placeholder="password">'),
        $('<input type="password" id="repeatedPassword" class="fadeIn sixth" name="login" placeholder="repeatedPassword">'),
        $('<input type="submit" class="fadeIn seventh" value="Register" onclick="passwordComf()">')

    );
    $('#formFooter').empty();
    $('#formFooter').append(
        $('<a onclick="changeToLoginForm()" class="underlineHover" href="#">').text('Have an account already?')
    );
    $('#formTitle').text('Register');
    loginPageInit();
}

function changeToLoginForm(){
    $('#errorText').remove();
    $('form').empty();
    $('form').append(
        $('<input type="text" id="emailLog" class="fadeIn second" name="login" placeholder="email">'),
        $('<input type="password" id="passwordLog" class="fadeIn third" name="login" placeholder="password">'),
        $('<input type="submit" class="fadeIn fourth" value="Log In" onclick="authenticate()">')
    );

    $('#formFooter').empty();
    $('#formFooter').append(
        $('<a onclick="changeToRegistrationForm()" class="underlineHover" href="#">').text('Don\'t have an account?')
    );
    $('#formTitle').text('Log In');
    loginPageInit();
}

function authenticate(){
    $("form").submit(function(e){
        e.preventDefault();
    });
    email = $('#emailLog').val().toLowerCase();
    password = $('#passwordLog').val().toLowerCase(); 
    $('#errorText').remove();
    var counter = 0;
    if($('#emailLog').val() != '' && $('#passwordLog').val() != ''){
        $.ajax({
            method: 'GET',
            url: 'register',
            success: function (result) {
                for(var i = 0; i < result.length; i++){
                    counter++;
                    if(result[i].email == email){
                        checkLogin();
                        break;
                    }
                    else if(result[i].email != email && counter == result.length){
                        $('#errorText').remove();
                        var $errorP = $('<p id="errorText">').text('The email or password is incorrect!');
                        $errorP.css('color', 'red');
                        $('#errorFooter').append(
                            $errorP
                        );
                        $('#passwordLog').css('border', '1px solid #ff0000');
                        $('#emailLog').css('border', '1px solid #ff0000');

                    }
                    


            }
        }
        });
    }
    else{
        var $errorP = $('<p id="errorText">').text('You have to fill all fields!');
        $errorP.css('color', 'red');
        $('#errorFooter').append(
            $errorP
        );
        $('#passwordLog').css('border', '1px solid #ff0000');
        $('#emailLog').css('border', '1px solid #ff0000');
    }
}


function checkLogin(){
    email = $('#emailLog').val().toLowerCase();
    password = $('#passwordLog').val().toLowerCase();
    console.log(email); 
    userData = {
        email: email,
        password: password

    };
    $.ajax({
        method: 'POST',
        url: 'api/login',
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(results){
            var token = results;
            if(token == 'error'){
                $('#errorText').remove();
                    var $errorP = $('<p id="errorText">').text('The email or password is incorrect!');
                    $errorP.css('color', 'red');
                    $('#errorFooter').append(
                        $errorP
                    );
                    $('#passwordLog').css('border', '1px solid #ff0000');
                    $('#emailLog').css('border', '1px solid #ff0000');
            }
            else{
                goToMap(token);
            }
        }
    });
}

function goToMap(token){
    $.ajax({
        method: 'GET',
        headers: {
            'Authorization': token,
        },
        url: 'api/map',
        success: function (result) {

            window.location.href = result;

        }
    });
}

   


function passwordComf(){
    $("form").submit(function(e){
        e.preventDefault();
    });
    var firstName = $('#fName').val();
    var lastName = $('#lName').val();
    var email = $('#email').val().toLowerCase();
    var password = $('#password').val().toLowerCase();
    var repeatedP = $('#repeatedPassword').val().toLowerCase();
    var empty = false;
    $('input[type="text"]').each(function(){
        $(this).css('border', '');
        $('#errorText').remove();
        if($(this).val()=="" || $(this).val()==" "){
            empty =true;
            $(this).css('border', '1px solid #ff0000');
            return true;
        }
    });
    if (empty == true){
        
        $errorP = $('<p id="errorText">').text('You have to fill all fields!');
            $errorP.css('color', 'red');
            $('#errorFooter').append(
                $errorP
            );
    }

    else if(repeatedP !=password && repeatedP != ''){
        $errorP = $('<p id="errorText">').text('Your passwords do not match');
            $errorP.css('color', 'red');
            $('#errorFooter').append(
                $errorP
            );
            $('#password').css('border', '1px solid #ff0000');
            $('#repeatedPassword').css('border', '1px solid #ff0000');
    }

    else{
        saveAllForm();
    }

}

function saveAllForm(){
    firstName = $('#fName').val();
    lastName = $('#lName').val();
    email = $('#email').val().toLowerCase();
    password = $('#password').val().toLowerCase();
    insertIntoDB();
}

function insertIntoDB(){
    userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password

    };
    $.ajax({
        method: 'POST',
        url: 'register/register',
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function(result){
            changeToLoginForm();
        }

    });
}



