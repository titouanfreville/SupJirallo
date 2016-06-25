"use strict";
// Include part to have required modules ...
var mongoose = require('mongoose'),
  Users = require('./../models/users'),
  Ticket = require('./../models/tickets').Ticket,
  should= require('should'),
  User= Users.User,
  ProductOwner= Users.ProductOwner,
  Developer= Users.Developer;
// CONNECT TP TEST DN ----------------------------------------------------------------------------
if (mongoose.connection.readyState === 0) {
  // Connect to mongo DB as tester DB (DB only for TEST USAGE)
  // var connStr = 'mongodb://mongo_jiralo/tester';
  var connStr = 'mongodb://localhost/tester';
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
  dateOfBirth: new Date('2000','01','01')
});
// ----------------------------------------
// Product Owner --------------------------
// create a Product Owner
var testDupPo = new ProductOwner({
  name: 'PONoisette',
  password: 'ecureil',
  email: 'POnoisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26),
  po_ticket: []
});

var testNewPo = new ProductOwner({
  name: 'PO1Bug',
  password: '2000',
  email: 'PO1new@bug.2000',
  firstName: 'PO1Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01'),
  po_ticket: []
});

// ----------------------------------------
// Developpers ----------------------------

// create Dev
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
  name: 'PO2Bug',
  password: '2000',
  email: 'PO2new@bug.2000',
  firstName: 'PO2Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date('2000','01','01'),
  dev_ticket_field: 'Test'
});

// ----------------------------------------
// Tickets --------------------------------
// create Ticket
var testNewTicket = new Ticket({
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
    testDupUser.save(function(err){
      should.not.exist(err);
      done();
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
    testDupPo.save(function(err){
      should.not.exist(err);
      done();
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
    testDupDev.save(function(err){
      should.not.exist(err);
      done();
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
// TICKET TEST ------------------------------------------------------------------------------------
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

  after(function(done) {
    con.disconnect();
    done();
  })
});
// -----------------------------------------------------------------------------------------------