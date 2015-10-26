"use strict";
var request = require('request');
//https://api.dognzb.cr/api?t=search&apikey=&q=Warehouse%2013%20S05E06&o=json&cat=5040
var filesize = require('filesize');
var moment = require('moment');

class Dog
{
  constructor() {
    this.apiUrl = 'https://api.dognzb.cr/api';
    this.apiKey = '4c54d030b34855016551267bad5ae17f';
  }


  search(query, callback) {
    this.apiRequest('search', 'q=' + encodeURIComponent(query) + '&cat=5040', function(e, d) {
      if (e) {
        return callback(e);
      }
      var items = [];
      for(var x=0; x<d.length; x++) {
        var item = d[x];

        item.ago = moment(item.pubDate).from(moment());

        var attrs = [];
        for(var y=0; y<item.attr.length; y++) {
          var obj = {};
          var name = item.attr[y]['@attributes'].name;
          var value = item.attr[y]['@attributes']['value'];

          switch(name) {
            case 'size':
              value = filesize(value);
            case 'tvairdate':
            case 'grabs':
              item[name] = value;
              break;

          }

          obj[name] = value;
          attrs.push(obj);
        }
        item.attr = attrs;

        items.push(item);
      }

      callback(e, items);
    });
  }

  apiRequest(endpoint, args, callback) {
    var url = this.apiUrl + '?o=json&t=' + endpoint + '&apikey=' + this.apiKey + '&' + args;
    request({
      url: url
    }, function(e, d, b) {
      if (e) {
        return callback(e)
      }
      var json = JSON.parse(b);
      if (json && json.channel && json.channel.item) {
        return callback(e, json.channel.item);
      }

      callback(1);
    });
  }
}

module.exports = function(app) {

  app.Dog = Dog;
};