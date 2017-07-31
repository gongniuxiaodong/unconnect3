var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

//引用express-session
var session = require('express-session');
var multer = require('multer');
var mongoose = require('mongoose');
var app = express();


//新增multer和mongoose

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb",{useMongoClient:true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine("html",require("ejs")._express);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/login',index);
app.use('/register',index);
app.use('/home',index);
// app.use('/logout',index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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



//新增上multer和mongoose

app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({dest: path.join(__dirname, 'public/upload/temp')
}).any());
app.use(cookieParser());

app.use (session({
    resave:false,
    saveUninitialized:true,
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));
app.use(function (req,res,next) {
    res.locals.user = req.session.user;//从session获取user对象
    var err = req.session.error;//获取错误信息
    delete req.session.error;
    res.locals.message = "";//展示信息的message
    if(err){
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red">'+err+'</div>';
    }
    next();//中间件传递
});


app.listen(3000);
module.exports = app;
