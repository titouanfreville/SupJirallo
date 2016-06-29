// Comment Scheam -------------------------------------------
var mongoose = require('mongoose'),
    schema = mongoose.Schema;
// Schema Declaration ---------------------------------------
var comment = new schema();
comment.add({
  content: String,
  creationDate: Date,
  // REFERENCE TO ------
  ticket: String, // Will be used to store TICKET SUMMURY.
  author: String, // Will be used to store USER NAME.
});
// ----------------------------------------------------------
// Model building -------------------------------------------
var Comment;
if (mongoose.models.comment) {
  Comment = mongoose.model('Comment');
} else {
  Comment = mongoose.model('Comment', comment);
}
// ----------------------------------------------------------
// Model exportation ----------------------------------------
var Comments = {
  Comment: Comment, // Get model
  CScheme: comment // Get schema
}
module.exports = Comments;
// ----------------------------------------------------------