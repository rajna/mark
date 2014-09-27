
/**
 * Module dependencies
 */

//var mongodb = require("mongodb");
//var server = new mongodb.Server('localhost',27017,{auto_reconnect:true},10);
//var db = new mongodb.Db("mydb2",server,{safe:true});

var express = require('express'),
  swig = require('swig'),
  routes = require('./routes'),
  
  http = require('http'),
  path = require('path'), 
  //MongoStore = require('connect-mongo')(express),
  //settings = require('./settings'),
  flash=require('connect-flash');//页面的通知和错误信息显示

var app = express();


/**
 * Configuration
 */

// all environments
var port=process.env.PORT || 3000;
//app.set('port',port);
var io=require('socket.io').listen(app.listen(port)),
api=require('./routes/api');
api.init(app,io);
// Engine
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(flash());//页面的通知和错误信息显示
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
// app.use(express.session({
//   secret: settings.cookieSecret,
//   key: settings.db,
//   cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//   store: new MongoStore({
//     db: settings.db
//   })

// }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/books/:user/selfbooklist', api.selfbooklist);
app.get('/books/:user/booklist', api.booklist);
app.get('/books/:id', api.singleBook);
app.post('/books', api.addMark);
app.get('/books/comment/:id', api.singleBookftComment);
app.delete('/books/:id', api.removeMark);
app.post('/books/addComment', api.addComment);
app.post('/api/reg', api.reg);

//查用户列表
app.get('/user/:useremail/userlist', api.userlist);
//查询关注
app.get('/user/:useremail/fellowlist', api.fellowlist);
app.post('/folowUser/', api.folowUser);
//取消关注
app.post('/folowRemove/', api.folowRemove);

//登陆
app.post('/api/login', api.login);

//网络爬虫,爬书籍信息
app.post('/api/fetchBookface', api.fetchBookface);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + port);
});
