"use strict";
var async = require('async');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

class Show {
  /**
   * Grabs show info from db if available, or loads from tvdb.
   * @param opt set id and app
   * @param callback (error, showData)
   */
  constructor(opt, callback) {
    var app = opt.app;
    var me = this;
    me.models = app.models;

    this.id = opt.id;
    this.episodes = {};

    me.models.show.findOne({id: this.id}, function (e, d) {
      if (e) {
        return callback(e);
      }

      if (d) {
        console.log('from db');
        me.data = _.clone(d);
        callback(null, d);
      } else {
        console.log('from tvdb');
        app.tvdb.getSeriesAllById(this.id, function(e, d) {

          //save
          var saves = [];
          for (var x=0; x< d.Episodes.length; x++) {
            saves.push(function(episode) {
              return function(callback) {
                episode.EpisodeNumber = parseInt(episode.EpisodeNumber, 10);
                episode.SeasonNumber = parseInt(episode.SeasonNumber, 10);
                models.episode.create(episode, callback);
              }
            }(d.Episodes[x]));
          }
          async.series(saves, function(e, episodes) {
            if (e) {
              throw e;
            }

            delete d.Episodes;

            me.models.show.create(d, function(err, model) {
              if(err) return res.json({ err: err }, 500);

              me.data = _.clone(d);
              callback(null, d);
            });
          });
        });
      }
    });
  }

  /**
   * Gets episodes for show
   * @param callback (error, episodes)
   */
  getEpisodes(callback) {
    var me = this;

    var conditions = {
      seriesid: this.id
    };
    /*if (req.query.season) {
     conditions.SeasonNumber = req.query.season;
     }*/
    me.models.episode.find()
      .where(conditions)
      .sort({SeasonNumber: 'Desc'})
      .sort({EpisodeNumber: 'Desc'})
      .exec(function (e, episodes) {
        if (e) {
          return callback(e);
        }
        me.episodes = episodes;

        var seasons = {};
        for (var x=0; x<episodes.length; x++) {
          if (!seasons.hasOwnProperty(episodes[x].SeasonNumber)) {
            seasons[episodes[x].SeasonNumber] = [];
          }
          seasons[episodes[x].SeasonNumber].push(episodes[x]);
        }

        var keys = Object.keys(seasons);
        keys.reverse();
        var out = [];
        for(var x=0; x < keys.length; x++) {
          out.push({
            'season': keys[x],
            'episodes': seasons[keys[x]]
          })
        }

        callback(null, out);
      });
  }

  setLocalDir(dir, callback) {
    if (Array.isArray(dir)) {
      this.data.localDirs = dir;
    } else {
      this.data.localDirs = [dir];
    }

    var mergedData = _.defaults({}, this.data);
    delete mergedData.id;

    this.models.show.update({id: this.data.id}, mergedData, callback);
  }

  refreshLocalEpisodes(callback) {
    var me = this;
    var files = [];

    // TODO: figure out async to remove the sync calls
    function processDir(dir) {
      fs.readdirSync(dir).forEach(function(file) {
        var fullPath = path.join(dir, file);
        var stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          processDir(fullPath);
        } else {
          files.push(me.processFile(dir, file));
        }
      });
    }

    this.data.localDirs.forEach(function(dir) {
      processDir(dir);
    });

    return callback(files);
  }

  processFile(dir, file) {
    var me = this;
    var result = null;
    var formats = [
      {
        regex: /((\d+)x(\d+))/i,
        season: 2,
        episode: 3
      },
      {
        regex: /(S(\d+)E(\d+))/i,
        season: 2,
        episode: 3
      }
    ];

    _.each(formats, function(format) {
      if (format.regex.test(file)) {
        var match = format.regex.exec(file);
        result = {
          dir: dir,
          file: file,
          SeasonNumber: parseInt(match[format.season], 10),
          EpisodeNumber: parseInt(match[format.episode], 10)
        };
        me.updateEpisode(result, {local: {dir: dir, file: file}});
        return false;
      }
    });

    return result;
  }

  updateEpisode(finder, updates) {
    var me = this;

    var episode;
    var episodeIndex;
    _.each(this.episodes, function(ep, index) {
      if (ep.SeasonNumber == finder.SeasonNumber && ep.EpisodeNumber == finder.EpisodeNumber) {
        episode = ep;
        episodeIndex = index;
        return false;
      }
    });
    if (!episode) {
      console.log('couldnt find episode');
      return false;
    }

    var mergedData = _.defaults(updates, episode);
    console.log(mergedData);

    this.episodes[episodeIndex] = mergedData;

    // Don't pass ID to update
    finder = {id: mergedData.id};
    delete mergedData.id;
    me.models.episode.update(finder, mergedData, function(err, model) {

    });
  }
}

module.exports = function(app) {
  // ORM
  app.orm.loadCollection(app.Waterline.Collection.extend({
    identity: 'show',
    connection: 'myLocalDisk',
    schema: false
  }));

  // Class
  app.Show = Show;
};
