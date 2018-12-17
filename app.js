var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var register = require('./routers/register');
var passport = require('passport');
var jwt = require('jwt-simple');
var User = require('./models/register');
var config = require('./config/database');
var PORT = process.env.PORT || 4242;
var app = express();
var passed = false;
var token;
var firstName;
var lastName;
var email;
var distance;

var db_url = config.database;
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4242");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(passport.initialize());

app.use('/register', register);
app.use('/', express.static(__dirname + '/www'));

app.get('/', function(req,res){
    res.render('login');
});

var apiRoutes = express.Router();

apiRoutes.post('/signup', function(req, res){
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName){
        res.json({success: false, msg: 'Please fill every field'});
    } else{
        var newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            distance: req.body.distance
        });
        newUser.save(function(err){
            if(err){
                res.json({success: false, msg: 'Email already exists'});
            }else {
                res.json({success: true, msg: 'Nice!'});
            }
        })
    }
});

apiRoutes.post('/login', function(req,res){
    User.findOne({
        email: req.body.email
    }, function(err, user){
        if (err) throw err;

        if(!user){
            return res.status(403).send({success: false, msg: 'User doesn\'t exist'});
            
        } else{
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err){
                    var createdToken = jwt.encode(user, config.secret);
                    token = 'Bearer '+createdToken;
                    //res.json({success: true, token: 'Bearer ' + token});
                    //res.cookie('auth', 'Bearer ' + token);
                    res.send('Bearer '+createdToken);
                    
                    
                }else{
                    return res.status(403).send({success: false, msg: 'Wrong password'}); 
                }
            })
        }
    });
});

apiRoutes.get('/map', passport.authenticate('jwt', {session: false}), function (req, res){
    var createdToken = getToken(req.headers);
    if(createdToken){
        var decoded = jwt.decode(createdToken, config.secret);
        User.findOne({
            firstName: decoded.firstName
        }, function(err, user){
            if(err) throw err;

            if (!user){
                return res.status(403).send({success: false, msg: 'User not found'});
            }else {
                passed = true;
                return res.send('api/map/home');

            }
        })
    }else {
        return res.status(403).send({success: false, msg: 'No token provided'});
    }

});

apiRoutes.get('/map/home', function(req,res){
    if(passed == true){
        res.render('map');
    }
    else{
        res.redirect('/');
    }
});

apiRoutes.get('/profile/', function(req,res){
    res.send(token);
});

apiRoutes.get('/profile/authenticate', passport.authenticate('jwt', {session: false}), function (req, res){
    var createdToken = getToken(req.headers);
    if(createdToken){
        var decoded = jwt.decode(createdToken, config.secret);
        firstName = decoded.firstName;
        lastName = decoded.lastName;
        email = decoded.email;
        distance = decoded.distance;
        User.findOne({
            firstName: decoded.firstName
        }, function(err, user){
            if(err) throw err;

            if (!user){
                return res.status(403).send({success: false, msg: 'User not found'});
            }else {
                return res.send({url: '/api/profile/home'});

            }
        })
    }else {
        return res.status(403).send({success: false, msg: 'No token provided'});
    }

});

apiRoutes.get('/profile/home', function(req,res){
    if(passed == true){
        res.render('profile');
    }
    else{
        res.redirect('/');
    }
});

apiRoutes.get('/profile/details', function(req,res){
    if(passed == true){
        res.send({firstName : firstName, lastName: lastName, email: email, distance: distance});
    }
});


getToken = function(headers){
    if(headers && headers.authorization){
        var parted = headers.authorization.split(' ');
        if (parted.length === 2){
            return parted[1];
        } else {
            return null;
        }
    }else {
        return null;
    }
}

app.use('/api', apiRoutes);

require('./config/passport')(passport);
//app.use('/', home);

app.listen(PORT, function(){
    console.log('Server up and running');
});