var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var RegisterSchema = new Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    distance: {type: Number, required: true}
});

RegisterSchema.pre('save', function (next) {
    var user = this;
    
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});

module.exports = mongoose.model('Register', RegisterSchema);
