var express = require('express');
var app = express();
var path = require('path');

var HOME = '/home/tfreville'
var base_dir = '/git/SupJirallo/';
var views=base_dir+'views/'

app.use("/", express.static(base_dir));

app.get('/', function (req, res) {
   res.sendFile(path.join('/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// TO DEBUG so it can work from different roots ~~ 