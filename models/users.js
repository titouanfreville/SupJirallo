var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    extend = require('mongoose-schema-extend'),
    Tickets = require('./tickets'),
    Comments = require('./comments'),
    comment = Comments.CSheme,
    Comment = Comments.Comment,
    schema = mongoose.Schema,
    // ObjectId = schema.ObjectId,
    ticket = Tickets.TScheme,
    Ticket = Tickets.Ticket,
    SALT_WORK_FACTOR = 5;
// ########################### SCHEMES DEFINITION  ########################### //
// USER -------------------------------------------------------------------------
var user = new schema({
  name: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  role: String
}, {
  collection: 'users',
  discriminatorKey: 'role'
});
// ------------------------------------------------------------------------------
// ProductOwner -----------------------------------------------------------------
var po = user.extend({
  po_ticket: [ticket]
});
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
var dev = user.extend({
  dev_ticket: [ticket]
});
// ------------------------------------------------------------------------------
// ########################################################################### //
// ################################ FUNCTIONS ################################ //
// User -------------------------------------------------------------------------
user.pre('save', function(next) {
  var us = this;
  if (!us.isModified('password')) return next();
  // Salting
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next (err);    // Hashing
    bcrypt.hash(us.password, salt, function(err, hash) {
      if (err) return next(err);
      us.password = hash;
      next();
    });
  });
});
// Checking Password
user.methods.checkPass = function (testPass, cb) {
  bcrypt.compare(testPass, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
// ------------------------------------------------------------------------------
// Product Owner ----------------------------------------------------------------
po.methods.pocheckPass = user.methods.checkPass;

po.methods.createTicket = function (ticket, cb) {
  po = this;
  ticket.reporter = po.name;
  ticket.save(function(err) {
    po.po_ticket.push(ticket);
    cb(err);
  });
};

po.methods.updateTicket = function(ticket_name, new_ticket, cb) {
  po=this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    if (err) return cb(err);
    if (!t) return cb({name: 'MyOwnMessage', message: 'Error : The ticket you are trying to update is not existing'});
    if (new_ticket.description) t.description = new_ticket.description;
    if (new_ticket.priority) t.priority = new_ticket.priority;
    if (new_ticket.status) t.status = new_ticket.status;
    t.save(function(err) {
      po.po_ticket.push(t);
      cb(err);
    })
  })
}

po.methods.deleteTicket = function (ticket_name, cb) {
  po = this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    t.remove(function(err) {
      po.po_ticket.pull(t);
    });
    cb(err);
  });
};

po.methods.poComment = function(comment, ticket_name, cb) {
  po=this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    if (err) return cb(err);
    if (!t) return cb({name: 'MyOwnMessage', message: 'Error : You are trying to comment on a non existing issue. You must have lost yourself in the Lost Forest.'});
    t.createTicketComment(comment, po.name, function(err){
      if (err) return cb(err)
    });
    t.save(function(err) {
      cb(err, t.reporter);
    })
  })
}
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
// Checking Password
dev.methods.devcheckPass = user.methods.checkPass;
// Coment
dev.methods.devComment = function(comment, ticket_name, cb) {
  dev=this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    if (err) return cb(err);
    if (!t) return cb({name: 'MyOwnMessage', message: 'Error : You are trying to comment on a non existing issue. You must have lost yourself in the Lost Forest.'});
    t.createTicketComment(comment, dev.name, function(err){
      if (err) return cb(err)
    });
    t.save(function(err) {
      cb(err, t.reporter);
    })
  })
}
// Start Working
dev.methods.startWorking = function(ticket_name, cb) {
  dev=this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    if (err) return cb(err);
    if (!t) return cb({name: 'MyOwnMessage', message: 'Error : The ticket you are trying to work on is not existing'});
    if (t.assignee) return cb({name: 'MyOwnMessage', message: 'Error : Someone is alredy working on this ticket.'});
    t.assignee = dev.name;
    t.status = 'IN PROGRESS';
    t.save(function(err) {
      dev.dev_ticket.push(t);
      cb(err);
    })
  })
}
// Stop Working
dev.methods.stopWorking = function(ticket_name, status, cb) {
  dev=this;
  Ticket.findOne({summary: ticket_name}, function(err, t) {
    if (err) return cb(err);
    if (!t) return cb({name: 'MyOwnMessage', message: 'Error : The ticket you are trying to update has been deleted.'});
    if (t.assignee != dev.name) return cb({name: 'MyOwnMessage', message: 'Error : You are not working on this ticket.'});
    t.assignee = null;
    t.status = status;
    t.save(function(err) {
      dev.dev_ticket.pull(ticket_name);
      cb(err);
    })
  })
}
// ------------------------------------------------------------------------------
// ########################################################################### //
// ########################### MODULE EXPORTATIONS ########################### //
// User -------------------------------------------------------------------------
var User;
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', user);
}
// ------------------------------------------------------------------------------
// Product Owner ----------------------------------------------------------------
var ProductOwner;
if (mongoose.models.ProductOwner) {
  ProductOwner = mongoose.model('ProductOwner');
} else {
  ProductOwner = mongoose.model('ProductOwner', po);
}
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
var Developer;
if (mongoose.models.Developer) {
  Developer = mongoose.model('Developer');
} else {
  Developer = mongoose.model('Developer', dev);
}
// ------------------------------------------------------------------------------

var Users = {
  User: User,
  ProductOwner: ProductOwner,
  Developer: Developer,
  // SUser: user,
  // SPo: po,
  // SDev: dev
};

module.exports = Users;
// ------------------------------------------------------------------------------
