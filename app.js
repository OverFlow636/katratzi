"use strict";


//https://api.dognzb.cr/api?t=search&apikey=4c54d030b34855016551267bad5ae17f&q=Warehouse%2013%20S05E06&o=json&cat=5040

/*
var SABnzbd = require('sabnzbd');
var sabnzbd = SABnzbd('http://192.168.2.200:8080/', 'c2a947ab5867030b126711417c405b40');

console.log('Queue + History:');
sabnzbd.entries().each(function(entry) {
  console.log('-', entry.name, ',', entry.size / 1000 / 1000, 'MB');
});*/


/*


var warehouse = new Show({hi:"yes"});
var warehouse2 = new Show({hi:"yes2"});

warehouse.func();
warehouse2.func();

console.log(warehouse);
console.log(warehouse2);

*/


// App Setup
var express     = require('express');
var app         = express();
app.hbs         = require('express-hbs');
app.Waterline   = require('waterline');
app.orm         = new app.Waterline();
app.tvdb = new (require('node-tvdb/compat'))('F99767CE09713083');

// Middleware
app.use(express.static('public'));
app.use(function(req, res, next) {
  req.app = app;
  next();
});

// Helpers
require('./hbs-helpers')(app);

// DB ORM
require('./orm')(app);

// Start App Server
app.orm.initialize(app.ormConfig, function(err, models) {
  if (err) throw err;

  // Models
  app.models = models.collections;
  app.connections = models.connections;

  // Views
  app.engine('hbs', app.hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'views/layouts/main'
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');

  // Controllers
  require('./routes')(app);

  app.listen(3000);
  console.log("running http://localhost:3000/");
});
