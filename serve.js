// Module requierement --------------------------------------------------------------
require('rootpath');
var express      = require('express'),
    app          = express(),
    session      = require('express-session'),
    morgan       = require('morgan'),
    jwt          = require('jwt-simple'),
    bodyParser   = require('body-parser'),
    path         = require('path'),
    mongoose     = require('mongoose'),
    angoose      = require("angoose"),
    config       = require('./config/database'),
    Users        = require('./models/users'),
    Comment      = require('./models/comments').Comment,
    Ticket       = require('./models/tickets').Ticket,
    apiRoutes    = express.Router()
    User         = Users.User,
    ProductOwner = Users.ProductOwner,
    Developer    = Users.Developer;
// ----------------------------------------------------------------------------------
secure = function (req, res, next) {
  console.log("In midlle Ware ---------------------")
  console.log('Session : '+req.session);
  if (req.session) {
    if (req.session.loggedIn) {
      console.log('Logged');
      next();
    } else {
      console.log('Not logged');
      res.redirect('/');
    }
  }
  else {
    console.log('Session not defined');
    res.redirect('/');
  }
}

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// ----------------------------------------------------------------------------------
// Base configs ---------------------------------------------------------------------
// get request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log info to console
app.use(morgan('dev'));

// Init session
app.use(session({
  name: 'session',
  secret: 'bla',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 36000000,
    httpOnly: false // <- set httpOnly to false
  }
}))

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  console.log('Session ' + req.session.loggedIn);
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// Define root as current directory
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));
app.use('/main_view.html', express.static(path.join(__dirname, 'main_view.html')));

// Defin private as path so we can protect it
app.use('/private', secure);
app.use('/private', express.static(path.join(__dirname, 'private')));
// ----------------------------------------------------------------------------------
// Connect to Mongo -----------------------------------------------------------------
mongoose.connect(config.database);
// ----------------------------------------------------------------------------------
// Routing --------------------------------------------------------------------------
/** Angoose bootstraping */
angoose.init(app, {
   'module-dirs':'models',
   'mongo-opts': 'mongo_jiralo:27017/jiralo_db',
});

// Basic routes.
app.get('/', function (req, res) {
  console.log('Session : '+req.session.loggedIn);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', function(req, res) {
  res.send('Hello ! The API is Listening you :p ');
})

// Api Routes
apiRoutes.post('/signin', function(req, res){
  console.log('Session : '+req.session);
  User.findOne({
    name: req.body.name
  }, function(err, user){
    if (err) throw err;
    if (!user) {
      req.session.loggedIn=false;
      req.session.error='Authentication failed. User not found.'
      res.redirect('/');
    } else {
      if (user.role == 'ProductOwner') {
        user.pocheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              req.session.name = user.name;
              // var token = jwt.encode(user, config.secret);
              req.session.success = 'Authenticated as ' + user.name;
              res.redirect('private/index_po.html');
            });
          } else {
            req.session.loggedIn=false;
            req.session.error='Autentification failed. Wrong password.'
            res.redirect('/');
          }
        })
      }
      if (user.role == 'Developer') {
        user.devcheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              req.session.name = user.name;
              // var token = jwt.encode(user, config.secret);
              req.session.success = 'Authenticated as ' + user.name;
              res.redirect('private/');
            });
          } else {
            req.session.loggedIn=false;
            req.session.error='Autentification failed. Wrong password.'
            res.redirect('/');
          }
        })
      }
    }
  })
})

// Api Routes
apiRoutes.post('/private/newticket', function(req, res){
  console.log('Session : '+req.session);
  ProducOwner.findOne({
    name: req.session.name,
    role: 'ProducOwner'
  }, function(err, user){
    if (err) throw err;
    if (!user) {
      req.session.loggedIn=false;
      req.session.error='You have been removed from the PO List.... Bad for you :(';
      res.redirect('/');
    } else {
      if (user.role == 'ProductOwner') {
        user.pocheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              // var token = jwt.encode(user, config.secret);
              req.session.success = 'Authenticated as ' + user.name;
              res.redirect('private/');
            });
          } else {
            req.session.loggedIn=false;
            req.session.error='Autentification failed. Wrong password.'
            res.redirect('/');
          }
        })
      }
    }
  })
})

app.use('/', apiRoutes);
// start server
var server = app.listen(3000, function () {
    if (server.address().address == '::') {
      console.log('Server listening at http://localhost:' + server.address().port);
    }
    else {
      console.log('Server listening at http://'+ server.address().address + ':' + server.address().port);
    }
});
