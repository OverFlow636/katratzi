module.exports = function(app) {
  app.get('/shows', require('./routes/shows'));
  app.get('/show/:id', require('./routes/show'));

  app.get('/search', require('./routes/search'));

  app.get('/tvdbimages/:query', function(req, res) {
    var request = require('request');
    var fs = require('fs');

    try {
      var stat = fs.readFileSync('tvdbimages/banners/' + req.params.query);
      res.end(stat, 'binary');
    }
    catch (e) {

      var path = req.params.query.replace('---', '/');

      request({
        url: 'http://thetvdb.com/banners/' + path,
        encoding: null
      }, function(e, r, b) {
        if (!e && r.statusCode == 200) {
          res.set('Content-Type', r.headers['content-type']);
          res.set('Content-Length', b.length);//r.headers['content-length']);
          fs.writeFileSync('tvdbimages/banners/' + req.params.query, b);
          res.end(b, 'binary');
        }
      });

    }
  });

  app.get('/', function (req, res) {
    res.render('dashboard');
  });
};
