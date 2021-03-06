var log4js = require('log4js');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var log = log4js.getLogger("app");
var routes = require('./routes/index');
var users = require('./routes/users');
var rootdir = 'public';

//cache max age directive in seconds
var m = 86400000;
//response is only compressed if the byte size 
// is at or above this threshold
var t = 512;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// favicon
app.use(favicon(__dirname+'/public/favicon.ico'));

// use log4js
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

// compress responses
//app.use(compression({
//   threshold : t 
// }
//));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, rootdir), { maxAge : m }));
app.use(express.static(path.join(__dirname, rootdir)));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        log.error("Something went wrong:", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    log.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

