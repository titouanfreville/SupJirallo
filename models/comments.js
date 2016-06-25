var mongoose = require('mongoose'),
    Users = require('./tickets'),
    schema = mongoose.Schema;

var ticket = new schema({
  summary: { type: String, required: true, index: {unique: true}, sparse: true },
  description: String,
  priority: String,
  status: String,
  creationDate: Date,
  // REFERENCE TO ------
  reporter: {type: String, required: true, sparse: true}, // Will be used to store PRODUCT OWNER NAME.
  assignee: String, // Will be used to store DEVELOPER OWNER NAME.
  // REFET ----

})

var Ticket;
if (mongoose.models.Ticket) {
  Ticket = mongoose.model('Ticket');
} else {
  Ticket = mongoose.model('Ticket', ticket);
}

var Tickets = {
  Ticket: Ticket,
  TScheme: ticket
}

module.exports = Tickets;