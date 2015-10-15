"use strict";


/*

tvdb.getSeriesByName('Defiance', function(e, d) {
  console.log(d);
});
*/

/*

 [
  {
    seriesid: '84676',
    language: 'en',
    SeriesName: 'Warehouse 13',
    banner: 'graphical/84676-g7.jpg',
    Overview: 'After saving the life of an international diplomat in Washington D.C., a pair of U.S. Secret Service agents are whisked away to a covert location in South Dakota that houses supernatural objects that the U.S. Government has collected over the cen
    turies. Their new assignment: retrieve some of the missing objects and investigate reports of new ones.',
    FirstAired: '2009-07-07',
    Network: 'Syfy',
    IMDB_ID: 'tt1132290',
    zap2it_id: 'EP01159848',
    id: '84676'
  }
 ]
  */

///*tvdb.getSeriesAllById(84676, function(e, d) {
//  console.log(d);
//})*/

/*
 { id: '84676',
 Actors: '|Eddie McClintock|Joanne Kelly|Saul Rubinek|Allison Scagliotti|CCH Pounder|Jaime Murray|Aaron Ashmore|Genelle Williams|',
 Airs_DayOfWeek: null,
 Airs_Time: null,
 ContentRating: 'TV-PG',
 FirstAired: '2009-07-07',
 Genre: '|Adventure|Drama|Fantasy|Mystery|Science-Fiction|',
 IMDB_ID: 'tt1132290',
 Language: 'en',
 Network: 'Syfy',
 NetworkID: null,
 Overview: 'After saving the life of an international diplomat in Washington D.C., a pair of U.S. Secret Service agents are whisked away to a covert location in South Dakota that houses supernatural objects that the U.S. Government has collected over the centu
 ries. Their new assignment: retrieve some of the missing objects and investigate reports of new ones.',
 Rating: '8.3',
 RatingCount: '279',
 Runtime: '45',
 SeriesID: '75313',
 SeriesName: 'Warehouse 13',
 Status: 'Ended',
 added: '2009-01-19 07:27:17',
 addedBy: '3071',
 banner: 'graphical/84676-g7.jpg',
 fanart: 'fanart/original/84676-3.jpg',
 lastupdated: '1444036037',
 poster: 'posters/84676-9.jpg',
 tms_wanted_old: '1',
 zap2it_id: 'EP01159848' }

 */


//https://api.dognzb.cr/api?t=search&apikey=4c54d030b34855016551267bad5ae17f&q=Warehouse%2013%20S05E06&o=json&cat=5040

/*
var SABnzbd = require('sabnzbd');
var sabnzbd = SABnzbd('http://192.168.2.200:8080/', 'c2a947ab5867030b126711417c405b40');

console.log('Queue + History:');
sabnzbd.entries().each(function(entry) {
  console.log('-', entry.name, ',', entry.size / 1000 / 1000, 'MB');
});*/

/*
var yes = setInterval(function(){
  console.log('hi', yes);
  clearInterval(yes);
}, 1000)*/

/*

class Show {
  constructor(opt) {
    console.log(opt);
    this.opt = opt;
  }

  func() {
    console.log('func', this.opt)
  }
}

var warehouse = new Show({hi:"yes"});
var warehouse2 = new Show({hi:"yes2"});

warehouse.func();
warehouse2.func();

console.log(warehouse);
console.log(warehouse2);

*/


// app includes
var express = require('express');
var app = express();
var hbs = require('express-hbs');
var util = require('util');

hbs.registerHelper('pad', function(num, options) {
  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  return pad(num, 2)
});

// tv includes
var tvdb = new (require('node-tvdb/compat'))('F99767CE09713083');


app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: 'views/layouts/main'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');






app.get('/show/:id', function(req, res) {
  tvdb.getSeriesAllById(req.params.id, function(e, d) {
    console.log(d);
    res.render('show', {show:d});
  })
});

app.get('/search/:query', function(req, res) {
  tvdb.getSeriesByName(req.params.query, function(e, d) {
    console.log(d);
    res.render('search', {data:d});
  });
});

app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.render('hello')
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
