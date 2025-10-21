require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload')
var expressHttpContext = require('express-http-context');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());
app.use(expressHttpContext.middleware);

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/report', require('./routes/report'));
app.use('/master', require('./routes/master'));
app.use('/so-ship', require('./routes/soship'));
app.use('/scanout', require('./routes/scanout'));
app.use('/product', require('./routes/product'));
app.use('/putting', require('./routes/putting'));
// app.use('/receive', require('./routes/receive'));
app.use('/register', require('./routes/register'));
app.use('/transfer', require('./routes/transfer'));
app.use('/sales-order', require('./routes/sales_order'));
app.use('/sublocation', require('./routes/sublocation'));
app.use('/inventory-release', require('./routes/release'));
app.use('/set-location', require('./routes/set_location'));
app.use('/picking-list', require('./routes/picking_list'));
app.use('/stock-opname', require('./routes/stock_opname'));
app.use('/move-location', require('./routes/move_location'));
app.use('/purchase-order', require('./routes/purchase_order'));
app.use('/return-product', require('./routes/return_product'));
app.use('/inventory-receipt', require('./routes/inventory_receipt'));
app.use('/inventory-request', require('./routes/inventory_request'));

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
