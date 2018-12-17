var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var RegisterSchema = new Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100, unique: true},
    password: {type: String, required: true, max: 100},
    distance: {type: Number, required: true}
});

RegisterSchema.pre('save', function (next) {
  var user = this;
  
  bcrypt.hash(user.password, null, null, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

RegisterSchema.methods.comparePassword = function(passw, cb){
  bcrypt.compare(passw, this.password, function(err, isMatch){
    if(err){
      return cb(err);

    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Register', RegisterSchema);
