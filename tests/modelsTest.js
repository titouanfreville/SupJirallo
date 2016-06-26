"use strict";
// Include part to have required modules ...
var mongoose = require('mongoose'),
  Users = require('./../models/users'),
  Comment = require('./../models/comments').Comment,
  Ticket = require('./../models/tickets').Ticket,
  should= require('should'),
  User= Users.User,
  ProductOwner= Users.ProductOwner,
  Developer= Users.Developer;
// CONNECT TP TEST DN ----------------------------------------------------------------------------
if (mongoose.connection.readyState === 0) {
  // Connect to mongo DB as tester DB (DB only for TEST USAGE)
  var connStr = 'mongodb://mongo_jiralo/tester';
  // var connStr = 'mongodb://localhost/tester';
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
// -----------------------------------------------------------------------------------------------
// INIT TEST VALUES ------------------------------------------------------------------------------
// Simple User ----------------------------
// Correct ###
var testNewUser = new User({
  name: 'Noisette',
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Incomplete ###
var EmptyUserName = new User({
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyUserMail = new User({
  name: 'Omega',
  password: 'ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyUserPass = new User({
  name: 'Omega',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Duplicates ###
var testDupUserName = new User({
  name: 'Noisette',
  password: 'ecureil',
  email: 'noir@blanc',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var testDupUserMail = new User({
  name: 'Alpha',
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// ----------------------------------------
// Product Owner --------------------------
// Correct ###
var testNewProductOwner = new ProductOwner({
  name: 'PONoisette',
  password: 'ecureil',
  email: 'POnoisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Incomplete ###
var EmptyProductOwnerName = new ProductOwner({
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyProductOwnerMail = new ProductOwner({
  name: 'Omega',
  password: 'ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyProductOwnerPass = new ProductOwner({
  name: 'Omega',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Duplicates ###
var testDupProductOwnerName = new ProductOwner({
  name: 'PONoisette',
  password: '2000',
  email: 'new@bug.2000',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01')
});

var testDupProductOwnerMail = new ProductOwner({
  name: 'Omega',
  password: '2000',
  email: 'POnoisette@ecureil',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01')
});
// ----------------------------------------
// Developpers ----------------------------
// Correct ###
var testNewDeveloper = new Developer({
  name: 'DEVNoisette',
  password: 'ecureil',
  email: 'DEVnoisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Incomplete ###
var EmptyDeveloperName = new Developer({
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyDeveloperMail = new Developer({
  name: 'Omega',
  password: 'ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});

var EmptyDeveloperPass = new Developer({
  name: 'Omega',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
// Duplicates ###
var testDupDeveloperName = new Developer({
  name: 'DEVNoisette',
  password: '2000',
  email: 'new@bug.2000',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01')
});

var testDupDeveloperMail = new Developer({
  name: 'Omega',
  password: '2000',
  email: 'DEVnoisette@ecureil',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01')
});
// ----------------------------------------
// Tickets --------------------------------
var testNewTicket = new Ticket({
  summary: "Test1",
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});

var testEmptySummaryTicket = new Ticket({
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});

var testEmptyReporterTicket = new Ticket({
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});

var testDupTicket = new Ticket({
  summary: "Test1",
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});
// ----------------------------------------
// Comments -------------------------------
var testNewComment = new Comment({
  summary: "Test1",
  creationDate: new Date('2000','01','01'),
});

var testEmptySummaryTicket = new Ticket({
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});

var testEmptyReporterTicket = new Ticket({
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});

var testDupTicket = new Ticket({
  summary: "Test1",
  description: "First test :p",
  priority: "URGENT",
  status: "BROKEN",
  creationDate: new Date('2000','01','01'),
  reporter: null,
  assignee: null
});
// -----------------------------------------------------------------------------------------------
// STARTING TESTS --------------------------------------------------------------------------------
describe("Users", function(){
  it("Add a new user", function(done){
    testNewUser.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it("Should Failed to insert Incomplete Users", function(done){
    EmptyUserName.save(function(err){
      should.exist(err);
      err.name.should.be.equal('ValidationError');

      EmptyUserMail.save(function(err){
        should.exist(err);
        err.name.should.be.equal('ValidationError');

        EmptyUserPass.save(function(err){
          should.exist(err);
          err.name.should.be.equal('ValidationError');
          done();
        });
      });
    });
  });


  it("Should Failed (50% not link to time) to insert Duplicate Users", function(done){
    testDupUserName.save(function(err){
      should.exist(err);
      err.code.should.be.equal(11000);
      testDupUserMail.save(function(err){
        should.exist(err);
        err.code.should.be.equal(11000);
        done();
      });
    });
  });

  it('Should find an Existing user', function(done){
    User.findOne({name: 'Noisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('Noisette');
      done();
    });
  });

  it('Should not find an Imaginary user', function(done){
    User.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    });
  });

  it('Should validate correct Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      });
    });
  });

  it('Should not validate incorrect Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      });
    });
  });
});
// -----------------------------------------------------------------------------------------------
// PO TEST ---------------------------------------------------------------------------------------
describe("PO", function(){
  it("Add a new PO", function(done){
    testNewProductOwner.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it("Should Failed to insert Incomplete PO", function(done){
    EmptyProductOwnerName.save(function(err){
      should.exist(err);
      err.name.should.be.equal('ValidationError');

      EmptyProductOwnerMail.save(function(err){
        should.exist(err);
         err.name.should.be.equal('ValidationError');

        EmptyProductOwnerPass.save(function(err){
          should.exist(err);
          err.name.should.be.equal('ValidationError');
          done();
        });
      });
    });
  });


  it("Should Failed (50% not link to time) to insert Duplicate PO", function(done){
    testDupProductOwnerName.save(function(err){
      should.exist(err);
      err.code.should.be.equal(11000);

      testDupProductOwnerMail.save(function(err){
        should.exist(err);
        err.code.should.be.equal(11000);
        done();
      });
    });
  });

  it('Should not find an Imaginary PO', function(done){
    ProductOwner.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    });
  });

  it('Should validate correct Password', function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err,po){
      should.not.exist(err);
      should.exist(po);
      po.pocheckPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      });
    });
  });

  it('Should not validate incorrect Password', function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err,po){
      should.not.exist(err);
      should.exist(po);
      po.pocheckPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      });
    });
  });
});
// -----------------------------------------------------------------------------------------------
// DEV TEST --------------------------------------------------------------------------------------
describe("Dev", function(){
  it("Add a new Dev", function(done){
    testNewDeveloper.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it("Should Failed to insert Incomplete Dev", function(done){
    EmptyDeveloperName.save(function(err){
      should.exist(err);
      err.name.should.be.equal('ValidationError');

      EmptyDeveloperMail.save(function(err){
        should.exist(err);
        err.name.should.be.equal('ValidationError');

        EmptyDeveloperPass.save(function(err){
          should.exist(err);
          err.name.should.be.equal('ValidationError');
          done();
        });
      });
    });
  });


  it("Should Failed to insert Duplicate Dev", function(done){
    testDupDeveloperName.save(function(err){
      should.exist(err);
      err.code.should.be.equal(11000);

      testDupDeveloperMail.save(function(err){
        should.exist(err);
        done();
      });
    });
  });

  it('Should find an Existing Dev', function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('DEVNoisette');
      done();
    });
  });

  it('Should not find an Imaginary Dev', function(done){
    Developer.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    });
  });

  it('Should validate correct Password', function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err,dev){
      should.not.exist(err);
      should.exist(dev);
      dev.devcheckPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      });
    });
  });


  it('Should not validate incorrect Password', function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err,dev){
      should.not.exist(err);
      should.exist(dev);
      dev.devcheckPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      });
    });
  });
});
// -----------------------------------------------------------------------------------------------
// TICKET TEST -----------------------------------------------------------------------------------
describe("Ticket", function(){
  it("Create ticket ", function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err, po) {
      po.createTicket(testNewTicket, function(err){
        should.not.exist(err);
        Ticket.findOne({reporter: 'PONoisette'}, function (err,ticket) {
          should.not.exist(err);
          should.exist(ticket);
          ticket.reporter.should.be.equal('PONoisette');
          ticket.summary.should.be.equal('Test1');
          done();
        });
        po.save();
      });
    });
  });


  it("Should Failed to insert Incomplete Tickets", function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err, po) {
      po.createTicket(testEmptySummaryTicket, function(err){
      should.exist(err);
      err.name.should.be.equal('ValidationError');
      po.createTicket(testEmptyReporterTicket, function(err){
        should.exist(err);
        err.name.should.be.equal('ValidationError');
        done();
      });
    });
  });

  it("Should Failed to insert Duplicate Tickets", function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err, po) {
      po.createTicket(testDupTicket, function(err){
        should.exist(err);
        err.code.should.be.equal(11000)
        });
      });
    });
  });

  it('Start Working on a Ticket', function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err, dev) {
      dev.startWorking('Test1', function(err){
        should.not.exist(err);
        Ticket.findOne({assignee: 'DEVNoisette'}, function (err, ticket) {
          should.not.exist(err);
          should.exist(ticket);
          ticket.assignee.should.be.equal('DEVNoisette');
          ticket.summary.should.be.equal('Test1');
          done();
        });
        dev.save();
      });
    });
  });

  it('Stop Working on a Ticket', function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err, dev) {
      dev.stopWorking('Test1', function(err){
        should.not.exist(err);
        Ticket.findOne({assignee: 'DEVNoisette'}, function (err, ticket) {
          should.not.exist(err);
          should.not.exist(ticket);
          done();
        });
      });
    });
  });

});
// -----------------------------------------------------------------------------------------------
// COMMENT TEST ----------------------------------------------------------------------------------
describe("Comments", function(){
  it("Product Owner can Comment.", function(done){
    ProductOwner.findOne({name: 'PONoisette'}, function(err, po) {
      po.poComment(testNewComment, 'Test1',function(err){
        should.not.exist(err);
        Comment.findOne({author: 'PONoisette'}, function (err,ticket) {
          should.not.exist(err);
          should.exist(ticket);
          ticket.author.should.be.equal('PONoisette');
          done();
        });
        po.save();
      });
    });
  });


  it("Dev can Comment.", function(done){
    Developer.findOne({name: 'DEVNoisette'}, function(err, dev) {
      dev.devComment(testNewComment, 'Test1',function(err){
        should.not.exist(err);
        Comment.findOne({author: 'DEVNoisette'}, function (err,ticket) {
          should.not.exist(err);
          should.exist(ticket);
          ticket.author.should.be.equal('DEVNoisette');
          done();
        });
        dev.save();
      });
    });
  });

  after(function(done) {
    con.disconnect();
    done();
  })

});
// -----------------------------------------------------------------------------------------------


