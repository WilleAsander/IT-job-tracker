AF API 

http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan2

To find the ID of each county as well as unspecified counties and abrod. 1 will be our target for Stockholm as a starter.

http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=1

Shows the communes in each county to further pinpoint. 


http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden

To find the ID of each workfield. 3 will be our target as it is the ID for Data/IT jobbs.

http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=3

Shows all the different types of work in the Data/IT fields. (Notice the 3 at the end3)

To get requrest from Postman:
Go to headers add 3 keys
1st Key:Accept  Value: application/xml 
2nd Key:Accept-Language Value: sv
3rd Key: From  Value: YOUREMAIL-HERE (optional)

To get this to work on the page you use AJAX calls like this :

$.ajax({
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'sv'
        },
        //The API with the URL component and the id of IT-jobs from AF API
        url: 'https://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=' + URL + '&yrkesomradeid=3',
        success: function (result) {
            //A loop that goes through all jobs and send the id of the job to a function
            for (var i = 0; i < result.matchningslista.matchningdata.length; i++) {
                var annonsId = result.matchningslista.matchningdata[i].annonsid;
                getJobDetails(annonsId);
                
            }



        }
    });

    GET is the option Postman uses to get information, headers are the keys needed for the API to respond to the GET request, further testing showed 
    you did not need the 3rd key (YOUREMAIL) so it was left out in the progress. 
    This is then repeated a few times to get the right information, switching out the end of the URL for the right API calls. 