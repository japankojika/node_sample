global.app_root = __dirname;

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require("express-session");
const logger = require('morgan');
const models = require('./models');
const bodyParser = require('body-parser')
const csrf = require('csurf');
const crypto = require('crypto');

// set router
const topRouter = require('./routes/topRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.disable('etag');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
  httpOnly: true,
  secure: false,
  maxage: 1000 * 60 * 30
  }
})); 
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf({ cookie: false }));
app.use(express.static(path.join(__dirname, 'public')));

// use router
app.use('/', topRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
