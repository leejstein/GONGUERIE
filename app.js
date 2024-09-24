var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var announcementsRouter = require('./routes/announcements');
var viewPostRouter = require('./routes/viewpost');
var writePostRouter = require('./routes/writepost');
var signInRouter = require('./routes/signin');
var signUpRouter = require('./routes/signup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: "my key",
  resave: true,
  saveUninitialized: false,
  // https://dev.to/m__mdy__m/understanding-cookies-and-sessions-in-nodejs-3449
  // saveUninitialized should be false until the user Allows to
}));

app.use('/', indexRouter);
app.use('/announcements', announcementsRouter);
app.use('/viewpost', viewPostRouter);
app.use('/writepost', writePostRouter);
// app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);
app.use('/error', function(req, res, next) {
  let s = Number(req.query.errorcode) || 418;
  let clientErrorMessage = {
    404: "We couldn't find the page you were looking for.",
    418: "We have an unexpected error. (I became a teapot)",
    500: "We have an internal server error."
  };
  
  // Access the custom error message dynamically using brackets
  let errorMessage = clientErrorMessage[s] || "An unexpected error occurred.";
  res.status(s).render('error', { status: s, error: errorMessage });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// TODO: process.env.NODE_ENV === 'development'
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  let s = err.status || 500;
  
  if(req.app.get('env') === 'development') {
    res.status(s).render('error', { status: s, error: err });
  } else {
    // redirect to the error page to render client error message
    res.redirect('/error?errorcode=' + s);
  }
});

module.exports = app;
