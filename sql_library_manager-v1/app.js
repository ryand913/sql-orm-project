
const Sequelize = require('./models/index.js').sequelize;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


(async () => {
  try {
    await Sequelize.sync();
    await Sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((req,res,next) => {
  const err = new Error('The page you are looking for does not exist.');
  err.status = 404;
  next(err);
});



app.use((err,req,res,next) => {
  res.locals.error = err;
  if (err.status === 404)
  res.render('page-not-found', {title:"Page Not Found", error: err.message});
  else
  res.status(500).render('error', {title: "Unhandled error", errors: err});
  console.dir(err.status + " " + err.message);
});


module.exports = app;


