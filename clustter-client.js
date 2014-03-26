var cluster = require('cluster');

// forking from master
if (cluster.isMaster) {
  // counting cpus
  var cpuCount = require('os').cpus().length;

  // worker for each cpu
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

} else {

  var express = require('express');
      exphbs  = require('express3-handlebars'),
      http = require('http'),
      app = express(),
      api = 'http://localhost:5000/',
      hbs = null;

  // handlebars config & helpers
  hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
      getCategory: function (category) { return category.split(' ')[0].toLowerCase(); },
    }
  });

  var isDev = (process.env.NODE_ENV === 'development');

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');

  app.use('/static', express.static(__dirname + '/build'));

  app.get('/', function (req, res) {
    http.get(api + "stories", function (json) {
      var body = '';

      json.on('data', function(chunk) {
        body += chunk;
      });

      json.on('end', function() {
        var data = JSON.parse(body);
        res.render('home', { stories: data.stories, isDev: isDev });
      });
    });
  });

  app.get('/story/:id', function (req, res) {
    http.get(api+'story/'+req.params.id, function (json) {
      var body = '';

      json.on('data', function(chunk) {
        body += chunk;
      });

      json.on('end', function() {
        var data = JSON.parse(body);
        res.render('story', { story: data.story, isDev: isDev });
      });
    });
  });

  app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404');
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  var server = app.listen(4000, function() {
    console.log('Listening on port %d', server.address().port);
  });
}
