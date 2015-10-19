var diskAdapter = require('sails-disk');

module.exports = function(app) {
  app.ormConfig = {
    adapters: {
      'default': diskAdapter,
      disk: diskAdapter
    },
    connections: {
      myLocalDisk: {
        adapter: 'disk'
      }
    },
    defaults: {
      migrate: 'alter'
    }
  };

  require('./models/show')(app);
  require('./models/episode')(app);
};
