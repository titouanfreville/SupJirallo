// var mongoose = require("mongoose"),
//     Schema = mongoose.Schema;
//     // relationship = require("mongoose-relationship");


// if (mongoose.connection.readyState == 0) {
//   // Connect to mongo DB as tester DB (DB only for TEST USAGE)
//   // var connStr = 'mongodb://mongo_jiralo/tester';
//   var connStr = 'mongodb://localhost/some_tester';
//   var con = mongoose.connect(connStr);
// }

// var dbcon = mongoose.connection;

// dbcon.on('error', console.error.bind(console, 'connection error:'));

// dbcon.once('open', function callback() {
//   console.log("Well Connected")
// });

// // // require('mongo-relation');

// var childSchema = new Schema({ name: 'string' });

// var parentSchema = new Schema({
//   children: [childSchema]
// })

// var Parent = mongoose.model('Parent', parentSchema);
// var Children = mongoose.model('Children', childSchema);

// var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })
// parent.children[0].name = 'Matthew';
// parent.save(function(err){
//   if (err) throw err;
//   console.log('Passed');
//   Parent.find({}, function(err, parent) {
//       if (err) throw err;
//       console.log('Parent :'+parent);
//     });
// });;

// var parent3 = new Parent({})
// var parent2 = new Parent({})

// var childish = new Children({name: 'Child :)'});
// childish.save(function(err){
//   if (err) throw err;
//   console.log('Childssssss');
//   Children.find({}, function(err, child) {
//     if (err) throw err;
//     console.log('Childs :'+child);
//   })
// })

// childSchema.pre('save', function (next) {
//   if ('invalid' == this.name) return next(new Error('#sadpanda'));
//   next();
// });

// var parent = new Parent({ children: [{ name: 'invalid' }] });
// parent.save(function (err) {
//   console.log(err.message) // #sadpanda
// })
