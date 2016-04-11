var async = require('async');
var router = require('express').Router();

module.exports = function() {

  router.use('/edit/:id', edit);
  router.use('/:id', view);
  router.use(index);

  return router;
}

function edit(req, res) {
  var app = req.app;
  var tvdb = app.tvdb;

  var where =  {id: req.params.id};
  app.models.show.find({
    where: where
  }).exec(function(err, models) {

    if (req.method === 'POST') {
      req.body.localDirs = req.body.localDirs.split('|');

      app.models.show.update({
        where: where
      }, req.body, function (err, model) {

      })
    }

    var show = models[0];
    show.localDirs = (show.localDirs || []).join('|');
    res.render('edit', {show: show});
  });

}

function index(req, res) {
  var app = req.app;
  var tvdb = app.tvdb;

  console.log('finding shows');
  app.models.show.find().exec(function(err, models) {
    console.log('found shows')
    if(err) return res.json({ err: err }, 500);
    res.render('shows', {shows:models});
  });
};



function view(req, res) {
  var app = req.app;

  var show = new app.Show({
    app: app,
    id: req.params.id
  }, function(error, showData) {
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    show.getEpisodes(function(err, data) {
      var bc = [
        {
          href: '/shows',
          title: 'TV Shows',
          class: 'title'
        },
        {
          href: '/show/' + show.id,
          title: show.SeriesName,
          class: 'active'
        }
      ];
      showData.Episodes = data;

      //show.setLocalDir('/mnt/drobo/tv/Farscape/', function(e, d) {
      //  console.log('local set', e, d)
      //  res.render('show', {show: showData, breadcrumbs: bc});
      //});

      //show.refreshLocalEpisodes(function(files) {
      //  res.render('show', {show: showData, breadcrumbs: bc});
      //});

      res.render('show', {show: showData, breadcrumbs: bc});
    });

  });
};
