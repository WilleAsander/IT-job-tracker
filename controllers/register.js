var Register = require('../models/register');

exports.userRegister = function(req,res){
    var register = new Register({
        fistName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    
    register.save(function(error){
        //obs hantera error
        if (error){
            return next(error);
        }
        res.send('Product created');
    });
};