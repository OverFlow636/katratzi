module.exports = function(req, res) {
  var app = req.app;
  var tvdb = app.tvdb;

  if (req.query.q) {
    console.log('Searching for: ' + req.query.q);
    tvdb.getSeriesByName(req.query.q, function (e, d) {
      console.log(d);
      res.render('results', {data: d, q:req.query.q});
    });
  } else {
    res.render('search', {});
  }
};
