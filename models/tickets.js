var schema = mongoose.Schema;

var ticket = new schema({
  _id : Number,
  summary: String,
  description: String,
  priority: Number,
  status: String,
  creationDate: Date,
  PO: ObjectId // or Array.,
  PO: Array
})