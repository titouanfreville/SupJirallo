// Ticket Schema --------------------------------------------
var mongoose = require('mongoose'),
    Comment = require('./comments').CScheme, // get comment schema
    schema = mongoose.Schema;
// Schema Declaration ---------------------------------------
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
  comments: [Comment] // Store comments sub document
})
// ----------------------------------------------------------
// Ticket methods -------------------------------------------
// Create Comment
// @require comment Comment document
// @require author_name Name of the User creating the comment
// @set Comment as new document for comment collection, author_name as author for comment,
//      ticket summary as ticket for comment
// @ensure Comment is well created in base with the good ticket reference && author.
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
// ----------------------------------------------------------
// Ticket model creation ------------------------------------
var Ticket;
if (mongoose.models.Ticket) {
  Ticket = mongoose.model('Ticket');
} else {
  Ticket = mongoose.model('Ticket', ticket);
}
// ----------------------------------------------------------
// Ticket module --------------------------------------------
var Tickets = {
  Ticket: Ticket,
  TScheme: ticket
}
module.exports = Tickets;
// ----------------------------------------------------------