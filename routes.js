module.exports = function(app) {
  app.get('/shows', require('./routes/shows'));
  app.get('/show/:id', require('./routes/show'));

  app.get('/search', require('./routes/search'));

  app.get('/', function (req, res) {
    res.render('dashboard');
  });
};
