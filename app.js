var mongoose = require("mongoose");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require("./configs/apiconfig");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var campaignRouter = require('./routes/campaign');
var categoryRouter = require('./routes/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Connect to database
const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

const connectString = config.DB_CONNECTION;
mongoose.connect(connectString, option).then(function(){
    console.log('Connection...');
}, function(err) {
     console.log('FAILURE: ', error)
});

// Add headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campaign',campaignRouter);
app.use('/category',categoryRouter);

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
