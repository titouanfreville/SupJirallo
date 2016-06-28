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

not_po = function (req, res, next) {
  console.log("In midlle Ware ---------------------")
  console.log('Session.role : '+req.session.role);
  if (req.session) {
    if (req.session.role == 'ProductOwner') {
      console.log('Ok :)');
      next();
    } else {
      console.log('Can not access');
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
  var msg = req.session.successs;
  console.log('Session ' + req.session.loggedIn);
  delete req.session.error;
  delete req.session.successs;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg successs">' + msg + '</p>';
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
// Only PO can access here (be saffer.)
app.use('/po', not_po);
app.use('/po', express.static(path.join(__dirname, 'po')));


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
// Api Routes
apiRoutes.post('/signin', function(req, res){
  User.findOne({
    name: req.body.name
  }, function(err, user){
    if (err) throw err;
    if (!user) {
      req.session.loggedIn=false;
      req.session.error='Authentication failed. User not found.'
      res.json({success: false, message: 'Failed. User incorrect, please make sure you did not miss type.'});
    } else {
      if (user.role == 'ProductOwner') {
        user.pocheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              req.session.name = user.name;
              req.session.role = user.role;
              req.session.successs = 'Authenticated as ' + user.name;
              res.json({success: true, message: 'successs in adding new user', role: user.role});
            });
          } else {
            req.session.loggedIn=false;
            req.session.error='Autentification failed. Wrong password.'
            res.json({success: false, message: 'Failed. Password incorrect, please make sure you did not miss type.'});
          }
        })
      }
      if (user.role == 'Developer') {
        user.devcheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              req.session.name = user.name;
              req.session.role = user.role;
              // var token = jwt.encode(user, config.secret);
              req.session.successs = 'Authenticated as ' + user.name;
              res.json({success: true, message: 'successs in adding new user', role: user.role});
            });
          } else {
            req.session.loggedIn=false;
            req.session.error='Autentification failed. Wrong password.'
            res.json({success: false, message: 'Failed. Password incorrect, please make sure you did not miss type.'});
          }
        })
      }
    }
  })
})

// Api Routes
apiRoutes.post('/private/newticket', function(req, res){
  if (req.session.role == 'ProductOwner') {
    ProductOwner.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Product Owner list. Too Bad :('})
      } else {
        var new_ticket= new Ticket({
          summary: req.body.summary,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          creationDate: new Date(),
          reporter: null,
          assignee: null
        });
        user.createTicket(new_ticket, function(err) {
          if (err) {
            console.log(err);
            if (err.code='11000') {
              res.json({success: false, message: 'It seems like you already reported this issue. Please check that it is not a duplicate. If it is not, make another summary so it can pass :).'});
            } else {
              res.json({success: false, message: 'Internal error. Ticket failed to be created. Sorry for the inconveniance.'});
            }
          } else {
            res.json({success: true, message: 'Ticket well aded. :)'});
          }
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You have been removed from the PO List.... Bad for you :(';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})

apiRoutes.post('/destroy_session', function(req, res) {
  req.session.destroy();
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

module.exports = server;