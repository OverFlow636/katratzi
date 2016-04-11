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

  require('./show')(app);
  require('./episode')(app);
  require('./dognzb')(app);
};
