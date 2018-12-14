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
var bcrypt = require('bcrypt');
module.exports.bcrypt = bcrypt;

var db_url = config.database;
mongoose.connect(db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
                    var token = jwt.encode(user, config.secret);
                    //res.json({success: true, token: 'Bearer ' + token});
                    res.setHeader('Authorization', 'JWT ' + token);
                    res.header('Authorization', 'JWT ' + token).redirect('map');
                    //res.redirect('http://localhost:4242/api/map');
                    
                    
                }else{
                    return res.status(403).send({success: false, msg: 'Wrong password'}); 
                }
            })
        }
    });
});

apiRoutes.get('/map', passport.authenticate('jwt', {session: false}), function (req, res){
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            firstName: decoded.firstName
        }, function(err, user){
            if(err) throw err;

            if (!user){
                return res.status(403).send({success: false, msg: 'User not found'})
            }else {
                return res.render('map');

            }
        })
    }else {
        return res.status(403).send({success: false, msg: 'No token provided'});
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