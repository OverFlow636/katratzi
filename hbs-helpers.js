module.exports = function(app) {

  app.hbs.registerHelper('chop', function (text, count) {
    return text.substr(0, count);
  });

  app.hbs.registerHelper('tvdbimg', function(text) {
    if (text) {
      return text.replace(/\//g, '---');
    }
    return '';
  });

  app.hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

  app.hbs.registerHelper('pad', function (num, options) {
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    return pad(num, 2)
  });
};
