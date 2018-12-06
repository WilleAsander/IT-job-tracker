var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var location = require('./routers/location');
var PORT = process.env.PORT || 4242;
var app = express();

/*var db_url = 'mongodb://User1:passw0rd@ds113454.mlab.com:13454/winegoofs';
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/location', location);
app.use('/', express.static(__dirname + '/www'));
//app.use('/', home);

app.listen(PORT, function(){
    console.log('Server up and running');
});