module.exports = function(req, res) {
  var app = req.app;
  var tvdb = app.tvdb;

  app.models.show.find().exec(function(err, models) {
    if(err) return res.json({ err: err }, 500);
    res.render('shows', {shows:models});
  });
};
