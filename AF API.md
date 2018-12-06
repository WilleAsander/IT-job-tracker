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
3rd Key: From  Value: YOUREMAIL-HERE





