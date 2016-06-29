// Include part to have required modules ...
var mongoose = require('mongoose'),
  Users = require('./models/users'),
  Comment = require('./models/comments').Comment,
  Ticket = require('./models/tickets').Ticket,
  User= Users.User,
  ProductOwner= Users.ProductOwner,
  Developer= Users.Developer;
// CONNECT TP TEST DN ----------------------------------------------------------------------------
if (mongoose.connection.readyState === 0) {
  // Connect to mongo DB as tester DB (DB only for TEST USAGE)
  var connStr = 'mongodb://mongo_jiralo/jiralo_db';
  // var connStr = 'mongodb://localhost/jiralo_db';
  var con = mongoose.connect(connStr);
}

var dbcon = mongoose.connection;

dbcon.on('error', console.error.bind(console, 'connection error:'));

dbcon.once('open', function callback() {
  dbcon.db.dropDatabase(function(err, result){
    if (err) throw err;
  })
  console.log("Well Connected");
});
// Create Product Owners Account ------------
var PO1 = new ProductOwner({
  name: 'Marsu',
  password: 'mars',
  email: 'titouanfreville@hotmail.fr',
  firstName: 'Mars',
  lastName: 'Gonzales',
  dateOfBirth: new Date(1952,09,20)
});

var PO2 = new ProductOwner({
  name: 'Fantasio',
  password: 'fants',
  email: 'fanta@jirallo.fr',
  firstName: 'Fantasio',
  lastName: 'Franquin',
  dateOfBirth: new Date(1942,01,01)
});

var PO3 = new ProductOwner({
  name: 'BlackSheep',
  password: 'wolf',
  email: 'black_sheep@jirallo.fr',
  firstName: 'Black',
  lastName: 'Sheep',
  dateOfBirth: new Date(2006,09,19)
});

// Create Dev Account ----------------------
var Dev1 = new Developer({
  name: 'Gaston',
  password: 'gaffeur',
  email: 'glagaffe@jirallo.fr',
  firstName: 'Gaston',
  lastName: 'Lagaffe',
  dateOfBirth: new Date(1957,05,19)
});

var Dev2 = new Developer({
  name: 'Le Chat',
  password: 'chat',
  email: 'lechat@jirallo.fr',
  firstName: 'Le Chat',
  lastName: 'Geluck',
  dateOfBirth: new Date(1983,03,22)
});

var Dev3 = new Developer({
  name: 'PaM',
  password: 'espadon',
  email: 'philip.mortimer@jirallo.fr',
  firstName: 'Philip',
  lastName: 'Mortimer',
  dateOfBirth: new Date(1957,05,19)
});

var Dev4 = new Developer({
  name: 'Kira',
  password: 'deathgod',
  email: 'kira@jirallo.fr',
  firstName: 'Light',
  lastName: 'Yagami',
  dateOfBirth: new Date(1986,02,28)
});

var Dev5 = new Developer({
  name: 'L',
  password: 'Silence',
  email: 'l@jirallo.fr',
  firstName: 'L',
  lastName: 'Lawliest',
  dateOfBirth: new Date(1979,31,10)
});

var Dev6 = new Developer({
  name: 'Watari',
  password: 'wh',
  email: 'watari@jirallo.fr',
  firstName: 'Wataro',
  lastName: 'Wammy',
  dateOfBirth: new Date(2003,12,01)
});
// Put them in DB ----------------------
PO1.save(function(err) {
  if (err) console.log(err);
  PO2.save(function(err) {
    if (err) console.log(err);
    PO3.save(function(err) {
      if (err) console.log(err);
      Dev1.save(function(err) {
        if (err) console.log(err);
        Dev2.save(function(err) {
          if (err) console.log(err);
          Dev3.save(function(err) {
            if (err) console.log(err);
            Dev4.save(function(err) {
              if (err) console.log(err);
              Dev5.save(function(err) {
                if (err) console.log(err);
                Dev6.save(function(err) {
                  if (err) console.log(err);
                  process.exit(0);
                });
              });
            });
          });
        });
      });
    });
  });
});