module.exports = function(app) {
  var Episode = app.Waterline.Collection.extend({
    identity: 'episode',
    connection: 'myLocalDisk',
    schema: false
  });
  app.orm.loadCollection(Episode);
};
