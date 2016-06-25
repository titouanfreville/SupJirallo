// Include part to have required modules ...
var mongoose = require('mongoose'),
  Users = require('./../models/users'),
  should= require('should'),
  User= Users.User,
  ProductOwner= Users.ProductOwner,
  Developer= Users.Developer;

if (mongoose.connection.readyState == 0) {
  // Connect to mongo DB as tester DB (DB only for TEST USAGE)
  // var connStr = 'mongodb://mongo_jiralo/tester';
  var connStr = 'mongodb://localhost/tester';
  var con = mongoose.connect(connStr);
}

var dbcon = mongoose.connection;

dbcon.on('error', console.error.bind(console, 'connection error:'));

dbcon.once('open', function callback() {
  console.log("Well Connected")
});

// create a user
var testDupUser = new User({
  name: 'Noisette',
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var testNewUser = new User({
  name: 'Bug',
  password: '2000',
  email: 'new@bug.2000',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date(2000,01,01)
});
// Add test user in DB

// USER TEST -------------------------------------------------------------------------------------
describe("Users", function(){
  this.timeout(20000);
  before(function(done){
    testDupUser.save(function(err) {
    });
    setTimeout(function(){
      done()
    }, 1);
  })

  it("Add a new user (should not pass if Duplicate pass", function(done){
    testNewUser.save(function(err){
      should.not.exist(err);
      done();
    })
  })

  // This test seems to never be working. I'm quite sure it's a pb of sync DB - Classes
  it("Try to add Duplicate user should not pass if Add pass", function(done){
    this.timeout(20000000);
    setTimeout(function(){
      testDupUser.save(function(err) {
          should.exist(err);
          done()
        })
    },1);
  })

  it('Should find an Existing user', function(done){
    User.findOne({name: 'Noisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('Noisette');
      done();
    });
  })

  it('Should not find an Imaginary user', function(done){
    User.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    })
  })

  it('Should validate correct Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      })
    })
  })

  it('Should not validate incorrect Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      })
    })
  })
})
// -----------------------------------------------------------------------------------------------

// create a Product Owner
var testDupPo = new ProductOwner({
  name: 'PONoisette',
  password: 'ecureil',
  email: 'POnoisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26),
  po_ticket_field: 'Test'
});

var testNewPo = new ProductOwner({
  name: 'PO1Bug',
  password: '2000',
  email: 'PO1new@bug.2000',
  firstName: 'PO1Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date(2000,01,01),
  po_ticket_field: 'Test'
});

// PO TEST ---------------------------------------------------------------------------------------
describe("PO", function(){
  it("Add a new user", function(done){
    testNewPo.save(function(err){
      should.not.exist(err);
      done();
    })
  })


  it("Try to add Duplicate user", function(done){
    testDupPo.save(function(err){
      should.exist(err);
      done();
    })
  })

  it('Should find an Existing user', function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('PONoisette');
      done();
    });
  })

  it('Should not find an Imaginary user', function(done){
    ProductOwner.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    })
  })

  it('Should validate correct Password', function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err,po){
      should.not.exist(err);
      should.exist(po);
      po.pocheckPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      })
    })
  })

  it('Should not validate incorrect Password', function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err,po){
      should.not.exist(err);
      should.exist(po);
      po.pocheckPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      })
    })
  })
})
// -----------------------------------------------------------------------------------------------

// create a Product Owner
var testDupDev = new Developer({
  name: 'DEVNoisette',
  password: 'ecureil',
  email: 'DEVnoisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26),
  dev_ticket_field: 'Test'
});

var testNewDev = new Developer({
  name: 'PO1Bug',
  password: '2000',
  email: 'PO1new@bug.2000',
  firstName: 'PO1Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date(2000,01,01),
  dev_ticket_field: 'Test'
});

// DEV TEST --------------------------------------------------------------------------------------
describe("Dev", function(){
  it("Add a new user", function(done){
    testNewDev.save(function(err){
      should.not.exist(err);
      done();
    })
  })


  it("Try to add Duplicate user", function(done){
    testDupDev.save(function(err){
      should.exist(err);
      done();
    })
  })

  it('Should find an Existing user', function(done){
    User.findOne({name: 'DEVNoisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('DEVNoisette');
      done();
    });
  })

  it('Should not find an Imaginary user', function(done){
    User.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    })
  })

  it('Should validate correct Password', function(done){
    User.findOne({name: 'DEVNoisette'}, function(err,dev){
      should.not.exist(err);
      should.exist(dev);
      dev.checkPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      })
    })
  })


  it('Should not validate incorrect Password', function(done){
    User.findOne({name: 'DEVNoisette'}, function(err,dev){
      should.not.exist(err);
      should.exist(dev);
      dev.checkPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      })
    })
  })
  after(function(done) {
    con.disconnect();
    done();
  })
})
// -----------------------------------------------------------------------------------------------