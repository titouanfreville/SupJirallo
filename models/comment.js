var schema = mongoose.Schema;

var comment = new schema({
  _id : Number,
  content: String,
  creationDate: Date,
  T: ObjectId //or Array
  A: ObjectId //or Array
})