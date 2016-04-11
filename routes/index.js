module.exports = function(app) {

  app.use('/shows', require('./shows')());


  app.get('/search', require('./search'));

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

  app.all('/manualsearch', function(req, res) {
    if (req.body && req.body.q) {
      var dog = new app.Dog();

      dog.search(req.body.q, function(e, d) {
        if (e) {
          return res.render('manualsearch', {query:req.body.q});
        }
        console.dir(d[0]);
        res.render('manualsearch', {items:d, query:req.body.q});
      });

    } else {
      res.render('manualsearch');
    }
  });

  app.get('/download', function(req, res) {
    var SABnzbd = require('sabnzbd');
    var sabnzbd = SABnzbd('http://192.168.2.200:8080/', 'c2a947ab5867030b126711417c405b40');

    sabnzbd.queue.addurl(req.query.url).then(function(result) {
      res.json(result);
    });
  });

  app.get('/downloads', function(req, res) {
    var SABnzbd = require('sabnzbd');
    var sabnzbd = SABnzbd('http://192.168.2.200:8080/', 'c2a947ab5867030b126711417c405b40');

    sabnzbd.queue.entries().then(function(entries) {
      if (req.query.ajax) {
        res.json(entries);
      } else {
        res.render('downloads', {entries:entries});
      }
    });
  });

  app.get('/', function (req, res) {
    res.render('dashboard');
  });
};
