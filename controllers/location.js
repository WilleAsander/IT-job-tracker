var Local = require('../models/location');

exports.userLocation = function(req,res){
    Local.find(function(err, location){
        if (err) return next(err);
        res.send(location);
    });
};