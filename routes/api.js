/*
 * Serve JSON to our AngularJS client
 */
var crypto = require('crypto'); //密码加密模块
var mongoose=require('mongoose');
var uriUtil = require('mongodb-uri');
/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
 /*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
var real_mongodbUri = 'mongodb://guwu:1223@ds061238.mongolab.com:61238/mark';
var test_mongodbUri = 'mongodb://localhost/mark';
var mongooseUri = uriUtil.formatMongoose(real_mongodbUri);
mongoose.connect(mongooseUri, options);
var db=mongoose.connection;
db.on('error',function(){
    console.log("链接数据库失败");
    return;
});

var UserSchema=require('../models/user.js').UserSchema;
var MarkSchema=require('../models/mark.js').MarkSchema;
var User=db.model('users',UserSchema);
var Mark=db.model('marks',MarkSchema);

//用户登陆API
exports.login=function(req,res){
        var md5 = crypto.createHash('md5'), 
        password = md5.update(req.body.password).digest('hex')+""; 
        var query={email:req.body.email};
        User.find(query,function(err,user){
            var error='';
            if(user[0]){ 
                //如果存在，就返回用户的所有信息，取出password来和post过来的password比较
                if(user[0].password!=password){
                    error='密码不正确';
                    res.json({
                      error:error
                    });
                }else{ 
                    //req.session.user = user[0]; 
                    res.json({
                      user:user[0]
                    });
                    //res.redirect('/show'); 
                } 
            }else{ 
                error='用户不存在';
                res.json({
                      error:error
                    });
            } 
        });
        
}

//用户注册API
exports.reg=function(req,res){
  //在post请求后的反应
   //post信息中发送过来的name,password和repassword,用req.body获取
          var name = req.body.name, 
          password = req.body.password,
          email=req.body.email; 
        //对密码进行加密操作 
          var md5 = crypto.createHash('md5'), 
          password = md5.update(req.body.password).digest('hex'); 
          var user = new User({ 
            name: req.body.name, 
            password: password,
            email:req.body.email 
          }); 
       
             var success='注册成功!',
                 error='注册失败!';
            var query=User.find({})
            .or([{name:name},{email:email}])
            .exec(function(error,data){
              console.log(data);
              if(data){
                error='用户名或密码已被注册!';
                res.json({
                  error:error
                });
              }else{
                user.save(function(err,doc){ 
                if(err){ 
                  res.json({
                    error:error
                  });
                  
                } 
                //成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
                //req.session.user = user; 
                res.json({
                  success:doc.email
                });
                
              });
              }
            });
            
}


//书籍列表API
exports.booklist = function (req, res) {
      
      User.findOne({'name':req.params.user}).populate('followings').exec(function(error,users){
        var query=Mark.find({});
        if(users.followings){
           var peoples=[];
            peoples.push(req.params.user);
            users.followings.forEach(function(user,i){
              peoples.push(user.name);
            });
           query.where('user').in(peoples);
        }
        query.sort({'_id':-1});
        query.exec(function(error,data){
          var books =[];
          data.forEach(function (book, i) {
            books.push({
              id: book._id,
              name: book.name,
              pagenum: book.pagenum,
              bookdesc: book.bookdesc,
              bookface: book.bookface,
              user:book.user,
              date:book.date
            });
          });
          res.json(books);
        }); 
      });
      
    };

//书籍列表API
exports.selfbooklist = function (req, res) {
        var query=Mark.find({});
        query.where('user').in([req.params.user]);
        query.sort({'_id':-1});
        query.exec(function(error,data){
          var books =[];
          data.forEach(function (book, i) {
            books.push({
              id: book._id,
              name: book.name,
              pagenum: book.pagenum,
              bookdesc: book.bookdesc,
              bookface: book.bookface,
              user:book.user,
              date:book.date
            });
          });
          res.json(books);
        }); 
      
    };

//单个书籍API
exports.singleBook = function (req, res) { 
      var bookid=req.params.id; 
      Mark.find({_id:bookid},function(err,book){
      if(book[0]){
        res.json(book[0]);
      }else{
        res.json({error: "未获得数据"});
      }
      
     });  
    };

//单个书籍API
exports.singleBookftComment = function (req, res) { 
      var bookid=req.params.id; 
      Mark.findOne({_id:bookid}).populate('owner').exec(function(err,book){
      if(book){
        console.log(book);
        res.json(book);
      }else{
        res.json({error: "未获得数据"});
      }
      
     });  
    };

exports.addMark = function (req, res) {
  if(!req.body.user){
    res.json({
     msg:false
    });
  }
  var date=new Date();//获取当前时间
  var minute=date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
  /*var time={
     date: date, 
      year : date.getFullYear(), 
      month : date.getFullYear() + "-" + (date.getMonth()+1), 
      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(), 
      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() 
  }*/
   var book=new Mark({
    user:req.body.user,
    name:req.body.name,
    bookface:req.body.bookface,
    pagenum:req.body.pagenum,
    bookdesc:req.body.bookdesc,
    date:date
   });

    book.save(function(err, doc){
               if(err){
                   res.json({
                      msg:false
                    });
               }
               res.json({
                      msg:true
                    });
          })      
};

exports.addComment = function (req, res) {
  var markid=req.body._id,
  owner=req.body.user,
  content=req.body.content;
  if(!owner){
    res.json({
     msg:false
    });
  }

  var comment={
    owner:owner,
    content:content
  }

  Mark.findOne({'_id':markid},function(error,mark){
    mark.comment.push(comment);
    mark.save(function(err, doc){
               if(err){
                   res.json({
                      msg:false
                    });
               }
               res.json({
                      msg:true
                    });
          });  ;
  });   
};

exports.removeMark = function (req, res) {
   var id=req.params.id; 

          Mark.remove({_id:id},function(err, doc){
               if(err){
                  res.json({
                      msg:"系统出错"+id
                    });
               }
               //如果成功存入，返回{"status": 1}给客户端
               res.json({
                      msg:doc
                    });
          })
};



exports.baike = function (req, res) {
   var bookname=req.body.bookname;
   var request = require('request'),//会用到request 插件
   cheerio = require('cheerio'),//会用到cheerio插件
   http = require('http'),
   url = require('url');
   var host = 'http://book.douban.com/subject_search?search_text='+bookname;
   var html ="<ul><li>";
   request(host, function (error, response, data) {
     if (!error && response.statusCode == 200) {
       var $ = cheerio.load(data);     
       var bookfaces = [];
        
       $('ul.subject-list li.subject-item').each(function (i) {
         if(bookfaces.length<3)
          bookfaces.push({
            name: $(this).find('div.info h2 a').text(),
            bookface: $(this).find('div.pic a img').attr("src")
          });
       });
       
       res.json({
          bookfaces:bookfaces
        });
     }
   });
};

//用户列表
exports.userlist = function (req, res) {
    var useremail=req.params.useremail;
      User.findOne({'email':useremail}).exec(function(error,users){
        User.find({})
          .where('_id')
          .nin(users.followings)
          .exec(function(error,data){
            var users =[];
            if(data){
              data.forEach(function (user, i) {
              if(user.email!=useremail){
                users.push({
                  id: user._id,
                  name: user.name,
                  imgUrl: user.imgUrl,
                  follows:user.follows
                });
              }
              
            });
            }
            
            res.json(users);
          });     
      });

    };

//关注列表
exports.fellowlist = function (req, res) {
    var useremail=req.params.useremail;
      User.findOne({'email':useremail}).exec(function(error,users){
        User.find({})
          .where('_id')
          .in(users.followings)
          .exec(function(error,data){
            var users =[];
            if(data){
              data.forEach(function (user, i) {
                users.push({
                  id: user._id,
                  name: user.name,
                  imgUrl: user.imgUrl,
                  follows:user.follows
                });
              
            });
            }
            
            res.json(users);
          });     
      });

    };


exports.folowUser = function (req, res) {
  var curemail=req.body.user;
  if(!curemail){
    res.json({
     msg:false
    });
  }
  User.findOne({'email':curemail},function(error,user){
    user.followings.push(req.body.follow);
    user.save(function(err, doc){
               if(err){
                   res.json({
                      msg:false
                    });
               }
               res.json({
                      msg:true
                    });
          });  ;
  });
   
};

exports.folowRemove = function (req, res) {
  var curemail=req.body.user;
  if(!curemail){
    res.json({
     msg:false
    });
  }
  User.findOne({'email':curemail},function(error,user){
    user.followings.pop(req.body.follow);
    user.save(function(err, doc){
               if(err){
                   res.json({
                      msg:false
                    });
               }
               res.json({
                      msg:true
                    });
          });  ;
  });
   
};


