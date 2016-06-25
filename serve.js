require('rootpath');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var path = require('path');
var angoose= require("angoose");
var HOME = ''
var base_dir = '';
var views=base_dir+'views/'



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.use("/", express.static(__dirname));

// routes
// app.use('/login', require('./js/controllers/loginctrl'));
// app.use('/register', require('./js/controllers/registerctrl'));
// app.use('/app', require('./js/controllers/appctrl'));
// app.use('/api/users', require('./js/controllers/api/userctrl'));

// use JWT auth to secure the api
// app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

/** Angoose bootstraping */
angoose.init(app, {
   'module-dirs':'models',
   'mongo-opts': 'localhost:27017/jiralo_db',
});

app.get('/', function (req, res) {
   res.sendFile(path.join('index.html'));
});

app.post('/login', function(req, res) {
    console.log(req.body.desc);
    res.end();
});
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

// start server
var server = app.listen(3000, function () {
    if (server.address().address == '::') {
      console.log('Server listening at http://localhost:' + server.address().port);
    }
    else {
      console.log('Server listening at http://'+ server.address().address + ':' + server.address().port);
    }
});
