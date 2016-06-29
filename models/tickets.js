var mongoose = require('mongoose'),
    Comment = require('./comments').CScheme,
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
  // REFER ----
  comments: [Comment]
})


ticket.methods.createTicketComment = function (comment, author_name, cb) {
  ti = this;
  comment.ticket = ti.summary;
  console.log(ti.summary);
  comment.author = author_name;
  console.log(comment);
  comment.save(function(err) {
    ti.comments.push(comment);
    cb(err);
  });
};

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