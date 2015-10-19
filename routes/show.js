var async = require('async');

module.exports = function(req, res) {
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

      show.setLocalDir('/home/joey/PhpstormProjects/katratzi/TV/Farscape', function(e, d) {
        console.log('local set', e, d)
        res.render('show', {show: showData, breadcrumbs: bc});
      });

      //show.refreshLocalEpisodes(function(files) {
        //res.render('show', {show: showData, breadcrumbs: bc});
      //});

      //res.render('show', {show: showData, breadcrumbs: bc});
    });

  });
};
