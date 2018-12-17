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
    $('form').empty();
    $('form').append(
        $('<input type="text" id="fName" class="fadeIn second" name="login" placeholder="firstname">').val(firstName),
        $('<input type="text" id="lName" class="fadeIn third" name="login" placeholder="lastname">').val(lastName),
        $('<input type="text" id="email" class="fadeIn fourth" name="login" placeholder="email">').val(email),
        $('<input type="text" id="password" class="fadeIn fifth" name="login" placeholder="password">'),
        $('<input type="text" id="repeatedPassword" class="fadeIn sixth" name="login" placeholder="repeatedPassword">'),
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
    $('form').empty();
    $('form').append(
        $('<input type="text" id="emailLog" class="fadeIn second" name="login" placeholder="email">'),
        $('<input type="text" id="passwordLog" class="fadeIn third" name="login" placeholder="password">'),
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
    email = $('#emailLog').val();
    password = $('#passwordLog').val(); 
    $('#errorText').remove();
    if($('#emailLog').val() != '' && $('#passwordLog').val() != ''){
        $.ajax({
            method: 'GET',
            url: 'register',
            success: function (result) {
                for(var i = 0; i < result.length; i++){
                    if(result[i].email == email){
                        checkLogin();
                        return;
                    }
                    else{
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
    email = $('#emailLog').val();
    password = $('#passwordLog').val(); 
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
    var email = $('#email').val();
    var password = $('#password').val();
    var repeatedP = $('#repeatedPassword').val();
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
    email = $('#email').val();
    password = $('#password').val();
    sliderShow();
}

function sliderShow(){
    $('form').empty();
    $('#formFooter').empty();
    $('#formTitle').text('Please select distance of search radius');
    $('form').append(
        $('<div class="qty mt-5 fadeIn fadeIn second">').append(
            $('<span class="minus bg-dark">').text('-'),
            $('<input type="number" class="count" name="qty" value="5">'),
            $('<span class="plus bg-dark">').text('+')
        ),
        $('<input type="submit" class="fadeIn third" value="This is fine!" onclick="saveDistance()">')
    );
    $(document).ready(function(){
        $('.count').prop('disabled', true);
           $(document).on('click','.plus',function(){
            $('.count').val(parseInt($('.count').val()) + 5 );
        });
        $(document).on('click','.minus',function(){
            $('.count').val(parseInt($('.count').val()) - 5 );
                if ($('.count').val() == 0) {
                    $('.count').val(5);
                }
            });
     });

     $('#formFooter').append(
        $('<a onclick="changeToRegistrationForm()" class="underlineHover" href="#">').text('Back to registration')
     );
}

function saveDistance(){
    distance = $('.count').val();
    insertIntoDB();
}

function insertIntoDB(){
    userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        distance: distance

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



