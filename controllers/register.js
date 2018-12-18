var Register = require('../models/register');

exports.userRegister = function(req,res){
    var register = new Register({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    
    register.save(function(error){
        //obs hantera error
        if (error){
            return next(error);
        }
        res.send('Product created');
    });
};

exports.list = function(req,res){
    Register.find(function(err, user){
        if (err) return next(err);

       res.send(user);
    });
};

exports.login = function(req,res){
    Register.findById(req.params.id, function(err, user){
        if (err) return next(err);

        res.send(user);
    });
}