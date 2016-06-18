var schema = mongoose.Schema;

var user = new schema({
  _id : Number,
  name: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  dateOfBirth: Date
});

// Sub _ "classes"
// Product Owner
var productowner = new schema ({
  _id : Number,
  name: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  dateOfBirth: Date,
  Ti_list: ID_List //need to find how to :p
});

// Developer
var developer = new schema ({
  _id : Number,
  name: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  dateOfBirth: Date,
  Ti_list: ID_List //need to find how to :p
});