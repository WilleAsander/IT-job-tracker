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
        if($(this).val()==""){
            empty =true;
            $(this).css('border', '1px solid #ff0000');
            return true;
        }
    });
    if (empty == true){
        
        $errorP = $('<p id="errorText">').text('You have to fill all fields!');
            $errorP.css('color', 'red');
            $('#wrapper').append(
                $errorP
            );
    }

    if(repeatedP !=password && repeatedP != ''){
        $errorP = $('<p id="errorText">').text('Your passwords do not match');
            $errorP.css('color', 'red');
            $('#wrapper').append(
                $errorP
            );
            $('#password').css('border', '1px solid #ff0000');
            $('#repeatedPassword').css('border', '1px solid #ff0000');
    }

    else{
        insertIntoDB();
    }

}

