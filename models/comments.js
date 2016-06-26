var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var comment = new schema();
comment.add({
  content: String,
  creationDate: Date,
  // REFERENCE TO ------
  ticket: String, // Will be used to store TICKET SUMMURY.
  author: String, // Will be used to store USER NAME.
});

var Comment;
if (mongoose.models.comment) {
  Comment = mongoose.model('Comment');
} else {
  Comment = mongoose.model('Comment', comment);
}

var Comments = {
  Comment: Comment,
  CScheme: comment
}

module.exports = Comments;