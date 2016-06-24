var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var user = new schema({
  _id : Number,
  name: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true },
  // firstName: String,
  // lastName: String,  
  // dateOfBirth: Date
});

user.pre('save', function(next) {
  var us = this;
  if (!us.isModified('password')) return next();
  console.log('Starting to add User');

  // Salting
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next (err);
    console.log('Salt generated');
    // Hashing
    bcrypt.hash(us.password, salt, function(err, hash) {
      if (err) return next(err);
      us.password = hash;
      console.log('Done adding user');
      next();
    })
  });
});

// Checking Password
user.methods.checkPass = function (testPass, cb) {
  bcrypt.compare(testPass, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', user);

// // Sub _ "classes"
// // Product Owner
// var productowner = new schema ({
//   _id : Number,
//   name: String,
//   password: String,
//   firstName: String,
//   lastName: String,
//   email: String,
//   dateOfBirth: Date,
//   Ti_list: ID_List //need to find how to :p
// });

// // Developer
// var developer = new schema ({
//   _id : Number,
//   name: String,
//   password: String,
//   firstName: String,
//   lastName: String,
//   email: String,
//   dateOfBirth: Date,
//   Ti_list: ID_List //need to find how to :p
// });
