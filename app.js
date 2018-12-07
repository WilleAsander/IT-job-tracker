var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var register = require('./routers/register');
var PORT = process.env.PORT || 4242;
var app = express();

var db_url = 'mongodb://User:Passw0rd@ds227654.mlab.com:27654/itjobb-login';
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/register', register);
app.use('/', express.static(__dirname + '/www'));
//app.use('/', home);

app.listen(PORT, function(){
    console.log('Server up and running');
});