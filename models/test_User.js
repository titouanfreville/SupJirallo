require('rootpath');
var path = require('path');

var mongoose = require('mongoose'),
    User = require('./user');

var connStr = 'localhost/mongoose-bcrypt-test';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log("Successfully connected to MongoDB");
});

// create a user a new user
var testUser = new User({
    name: 'jmar777',
    password: 'Password123',
    email: 'String'
});

// save user to database
testUser.save(function(err) {
    if (err) throw err;
    console.log("Supposely saved");
});


// fetch user and test password verification
User.findOne({ name: 'jmar777' }, function(err, user) {
    if (err) throw err;
    console.log(user);
    // test a matching password
    user.checkPass('Password123', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -&gt; Password123: true
    });

    // test a failing password
    user.checkPass('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -&gt; 123Password: false
    });
});
