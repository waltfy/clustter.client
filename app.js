/* dependencies */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    io = require('socket.io');

var app = express();

/* all environments */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'dist')));

/* local access to node vars */
app.locals.env = app.get('env');

/* development env */
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* production env */
if ('production' == app.get('env')) {
  /* do production reqs */
}

app.get('/', function (req, res) {
  res.render('home', { title: 'Home' })
});

app.get('/login', function (req, res) {
  res.render('login', { title: 'Sign in' })
});

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Clustter App server listening on port ' + app.get('port'));
});

// io.listen(server);