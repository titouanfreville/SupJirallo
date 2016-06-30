// Module requierement --------------------------------------------------------------
require('rootpath');
var express      = require('express'),
    app          = express(),
    session      = require('express-session'),
    nodemailer   = require('nodemailer')
    morgan       = require('morgan'),
    // jwt          = require('jwt-simple'),
    bodyParser   = require('body-parser'),
    path         = require('path'),
    mongoose     = require('mongoose'),
    angoose      = require('angoose'),
    xoauth2      = require('xoauth2'),
    flash        = require('express-flash-notification'),
    config       = require('./config/database'),
    Users        = require('./models/users'),
    Comment      = require('./models/comments').Comment,
    Ticket       = require('./models/tickets').Ticket,
    apiRoutes    = express.Router()
    User         = Users.User,
    ProductOwner = Users.ProductOwner,
    Developer    = Users.Developer;
// Create and configure mail sender (We are using a GMail sender via a dumb mail adress for the project.)
var transporter  = nodemailer.createTransport({
  service: 'GMail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'supjirallo@gmail.com',
      clientId: '135474674442-ngot4g8g60mil7kbsnbnltv8b80l9tjt.apps.googleusercontent.com',
      clientSecret: 'CuAMhaXYueb2A8ITwAmaytG8',
      refreshToken: '1/zDX8W8RHXrCZhOZMk5DrHXgqHRtZsdGk-12Y3GoVqS4',
    })
  }
});
// Set basic mail option : from
var mailOptions  = {
  from: 'no-reply@supjirallo.com',
  to: null,
  subject: null,
  text: null
}
// ----------------------------------------------------------------------------------
// Middleware to secure path private. It checked if you are well logged. If you aren't, it send you back to root.
// Thought, as we are using Angular State, this is usefull only if people unactive javascript client ~~ 
// It ensure that you can't access private methods/views without being log in the app previously.
// If the server is shutdown, you need to log again, even if you were using the app.
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
// ----------------------------------------------------------------------------------
// Base configs ---------------------------------------------------------------------
// get request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// More logs on request with better informations.
app.use(morgan('dev'));

// Set up session
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
// Define root as current directory
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/index.html', express.static(path.join(__dirname, 'index.html')));
app.use('/main_view.html', express.static(path.join(__dirname, 'main_view.html')));
// Defin private as path so we can protect it
app.use('/private', secure);
app.use('/private', express.static(path.join(__dirname, 'private')));
// ----------------------------------------------------------------------------------
// Connect to Mongo -----------------------------------------------------------------
// If you are not using docker launch, please make sure to update the config file
// with your own database access
mongoose.connect(config.database);
// ----------------------------------------------------------------------------------
// Routing --------------------------------------------------------------------------
// Init angoose module so he can expose models for angular and acces database.
angoose.init(app, {
   'module-dirs':'models',
   'mongo-opts': 'mongo_jiralo:27017/jiralo_db',
});
// Base path / loadin index
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Api Routes #######################################################
// User Routes ######################################################
// Sign in function.
// @require name Request must have name paramter. It will be use to search the user.
// @ensure User is well login and able to use logged only services.
// @response {succes: false, message: error message } if fail, {success: true, message: 'Logged in succed'}
// @set session.loggedIn Will take value true if log in succed, false else
// @set session.role Save logged user role in session
// @set session.name Save logged user name in session
apiRoutes.post('/signin', function(req, res){
  User.findOne({
    name: req.body.name
  }, function(err, user){
    if (err) throw err;
    if (!user) {
      req.session.loggedIn=false;
      res.json({success: false, message: 'Failed. User incorrect, please make sure you did not miss type.'});
    } else {
      if (user.role == 'ProductOwner') {
        user.pocheckPass(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            req.session.regenerate(function(){
              req.session.loggedIn = true;
              req.session.name = user.name;
              req.session.role = user.role;
              res.json({success: true, message: 'You are now well log in :)', role: user.role});
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
              res.json({success: true, message: 'You are now well log in :)', role: user.role});
            });
          } else {
            req.session.loggedIn=false;
            res.json({success: false, message: 'Failed. Password incorrect, please make sure you did not miss type.'});
          }
        })
      }
    }
  })
})
// Destroy session function
// @response {success: true, message: 'Well Logged out. Please comme again'}
// @ensure Current session is destroyed.
apiRoutes.post('/destroy_session', function(req, res) {
  req.session.destroy(function() {
    res.json({success: true, message: 'Well Logged out. Please comme again :).'});
  })
})
// ##################################################################
// Manage Tickets Routes ############################################
// YOU NEED TO BE A PRODUCT OWNER TO USE THOSE METHODS.
// New Ticket function
// @require summary Summary of the ticket to create
// @param description Descrition for the new ticket
// @param priority Priortiy of the ticket
// @param status Status for the ticket
// @ensure Ticket is well created with provided value if no error occurs.
// @resonse {succes: false, message: error message} if failed, {success: true, message: 'Ticket well added.'} else
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
            if (err.code='11000') res.json({success: false, message: 'It seems like you already reported this issue. Please check that it is not a duplicate. If it is not, make another summary so it can pass :).'});
            else {
              if (err.name == 'MyOwnMessage') res.json({success: false, message: errti.message});
              else res.json({success: false, message: 'Internal error. Ticket failed to be created. Sorry for the inconveniance.'})
            }
          }
          else res.json({success: true, message: 'Ticket well aded. :)'});
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You have been removed from the PO List.... Bad for you :(';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})
// Update Ticket function
// @require summary Summary of the ticket to update
// @param description Descrition for the new ticket
// @param priority Priortiy of the ticket
// @param status Status for the ticket
// @ensure Ticket is updated if no error occurs
// @response {succes: false, message: error message} if failed, {success: true, message: 'Ticket well Updated.'} else
apiRoutes.post('/private/updateticket', function(req, res){
  if (req.session.role == 'ProductOwner') {
    ProductOwner.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Product Owner list. Too Bad :('})
      } else {
        var new_ticket= {
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
        };
        user.updateTicket(req.body.summary, new_ticket, function(err) {
          if (err) {
            if (err.name == 'MyOwnMessage') res.json({success: false, message: err.message});
            else res.json({success: false, message: 'Internal error. Ticket failed to be updated. Sorry for the inconveniance.'})
          }
          else res.json({success: true, message: 'Ticket well Updated. :)'});
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You have been removed from the PO List.... Bad for you :(';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})
// Delete Ticket function
// @require summary Summary of the ticket to update
// @resonse {succes: false, message: error message} if failed, {success: true, message: 'Ticket well deleted.'} else
// @ensure Ticket is deleted if no error occurs
apiRoutes.post('/private/deleteticket', function(req, res){
  if (req.session.role == 'ProductOwner') {
    ProductOwner.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Product Owner list. Too Bad :('})
      } else {
        user.deleteTicket(req.body.summary, function(err) {
          if (err) {
            if (err.name == 'MyOwnMessage') res.json({success: false, message: err.message});
            else res.json({success: false, message: 'Internal error. Ticket failed to be deleted. Sorry for the inconveniance.'})
          }
          else res.json({success: true, message: 'Ticket well deleted. :)'});
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You have been removed from the PO List.... Bad for you :(';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})
// ##################################################################
// Manage Workers ###################################################
// You need to be a Developer to use those functions
// Start Working function
// @require ticket_name Summary of the ticket to work on (used as name cause it is REQUIRED AND UNIQUE)
// @ensure User is set as assignee for the ticket and Ticket is in state IN PROGRESS.
// @resonse {succes: false, message: error message} if failed, {success: true, message: 'You are now working on this ticket :).'} else
apiRoutes.post('/private/startworking', function(req, res){
  if (req.session.role == 'Developer') {
    Developer.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Developer list. Too Bad :('})
      } else {
        user.startWorking(req.body.ticket_name, function(err) {
          if (err) {
            if (err.name == 'MyOwnMessage') res.json({success: false, message: res.message});
            else res.json({success: false, message: 'Internal error. Ticket failed to be deleted. Sorry for the inconveniance.'})
          } else {
            res.json({success: true, message: 'You are now working on this ticket :)'});
          }
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You have been removed from the Dev List.... Bad for you :(';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})
// Stop Working function
// @require ticket_name Summary of the ticket you finished working on (used as name cause it is REQUIRED AND UNIQUE)
// @ensure User is set as assignee for the ticket and Ticket is in state provided (TO DO if task not solved, DONE if solved).
// @resonse {succes: false, message: error message} if failed, {success: true, message: 'You are done working on this ticket and it is.' + new status} else
apiRoutes.post('/private/stopworking', function(req, res){
  if (req.session.role == 'Developer') {
    Developer.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Developer list. Too Bad :('})
      } else {
        user.stopWorking(req.body.ticket_name, req.body.status, function(err) {
          if (err) {
            if (err.name == 'MyOwnMessage') res.json({success: false, message: err.message});
            else res.json({success: false, message: 'Internal error. Ticket failed to be deleted. Sorry for the inconveniance.'})
          } else {
            res.json({success: true, message: 'You are done working on this ticket and it is '+ req.body.status});
          }
        })
      }
    });
  } else {
    req.session.loggedIn=false;
    req.session.error='You are not well log. Please try loggin again.';
    res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
  }
})
// ##################################################################
// Comment Routes ###################################################
// You need to be logged in to use this function ;)
// new Comment function
// @require ticket_name Summary of the ticket you finished working on (used as name cause it is REQUIRED AND UNIQUE)
// @param content Content of the comment to create
// @ensure Comment is created and linked to the good tickets and author. A mail is well send to the ticket reporter.
// @resonse {succes: false, message: error message} if failed, {success: true, message: 'Comment well aded..' + new status} else
apiRoutes.post('/private/newcomment', function(req, res){
  var new_comment = new Comment({
    content: req.body.content,
    creationDate: new Date(),
  });
  if (req.session.role == 'ProductOwner') {
    ProductOwner.findOne({
      name: req.session.name
    }, function(err, user){
      if (err) {
        res.json({success: false, message: 'Failed. You have been removed from the Product Owner list. Too Bad :('})
      } else {
        user.poComment(new_comment, req.body.ticket_name, function(err, reporter) {
          if (err) {
            if (err.name == 'MyOwnMessage') res.json({success: false, message: err.message});
            else res.json({success: false, message: 'Internal error. Ticket failed to be created. Sorry for the inconveniance.'})
          }
          else {
            ProductOwner.findOne({name: reporter}, function(err, reporter) {
              if (err) console.log('Oups, some Product Owner is no more well referenced .... ~~');
              else {
                mailOptions.to=reporter.email;
                mailOptions.subject = '[Jirallo] Comment added by '+user.name+', about '+ req.body.ticket_name+ '.'
                mailOptions.html = '<h1>Hy '+reporter.name +',</h1></br><span>your ticket about '+ req.body.ticket_name +' as been commented by '+ user.name+ '.</span>'
                transporter.sendMail(mailOptions, function(err, info) {
                  if (err) console.log('Error while sending mail '+err);
                  else console.log('message sent: '+info);
                })
              }
            })
            res.json({success: true, message: 'Comment well aded. :)'});
          }
        })
      }
    })
  }
  else {
    if (req.session.role == 'Developer') {
        Developer.findOne({
        name: req.session.name
      }, function(err, user){
        if (err) {
          res.json({success: false, message: 'Failed. You have been removed from the Product Owner list. Too Bad :('})
        } else {
          user.devComment(new_comment, req.body.ticket_name, function(err, reporter) {
            if (err) {
              if (err.name == 'MyOwnMessage') res.json({success: false, message: err.message});
              else res.json({success: false, message: 'Internal error. Ticket failed to be created. Sorry for the inconveniance.'})
            }
            else {
              Developer.findOne({name: reporter}, function(err, reporter) {
                if (err) console.log('Oups, some Product Owner is no more well referenced .... ~~');
                else {
                  mailOptions.to=reporter.email;
                  mailOptions.subject = '[Jirallo] Comment added by '+user.name+', about '+ req.body.ticket_name+ '.'
                  mailOptions.html = '<h1>Hy '+reporter.name +',</h1></br><span>your ticket about '+ req.body.ticket_name +' as been commented by '+ user.name+ '.</span>'
                  transporter.sendMail(mailOptions, function(err, info) {
                    if (err) console.log('Error while sending mail '+err);
                    else console.log('message sent: '+info);
                  })
                }
              })
              res.json({success: true, message: 'Comment well aded. :)'});
            }
          })
        }
      })
    } else {
      req.session.loggedIn=false;
      req.session.error='You have been removed from the PO List.... Bad for you :(';
      res.json({succes: false, message: 'Failed. You are not Allowed to perform this action.'});
    }
  }
})
// ##################################################################
app.use('/', apiRoutes);
// start server
// Start serving on port 3000
var server = app.listen(3000, function () {
    if (server.address().address == '::') {
      console.log('Server listening at http://localhost:' + server.address().port);
    }
    else {
      console.log('Server listening at http://'+ server.address().address + ':' + server.address().port);
    }
});
// Export server as a module for unit testing need
module.exports = server;