/*
 * Serve JSON to our AngularJS client
 */
var crypto = require('crypto'), //密码加密模块
    User = require('../models/user.js'); //引入用户登录函数
    Book= require('../models/book.js');//图书函数


exports.checkNotLogin=function(req,res,next){
  if(req.session.user){
    res.json({
      user:req.session.user
    });
    return
  }
  next();
}

exports.logout=function(req,res){
  req.session.user=null;
  res.json({
    user:null
  });
  return;
}
//用户登陆API
exports.login=function(req,res){
        //post过来的密码加密
        var md5 = crypto.createHash('md5'), 
          password = md5.update(req.body.password).digest('hex'); 
        var newUser = new User({ 
          name: req.body.name, 
          password: password 
        }); 
        //查找用户
        User.get(newUser.name, function(err, user){ 
           var error='';
            if(user){ 
                //如果存在，就返回用户的所有信息，取出password来和post过来的password比较
                if(user.password != password){
                    error='密码不正确';
                    res.json({
                      error:error
                    });
                }else{ 
                    req.session.user = user; 
                    res.json({
                      user:user
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
        var newUser = new User({ 
          name: req.body.name, 
          password: password,
          email:req.body.email 
        }); 
       //使用user.js中的user.get() 函数来读取用户信息
        User.get(newUser.name, function(err, user){ 
            //如果有返回值，表示存在用户
            var success='注册成功!',
                error='注册失败!';
            if(user){ 
              err = '用户已存在!'; 
            } 
            if(err){
              //如果报错，记录错误信息和页面跳转
              //req.flash('error', err); 
              res.json({
                  error: err
                });
              return;
              //return res.redirect('/'); 
            } 
            //使用user.js的user.save() 保存信息函数
            newUser.save(function(err,user){ 
              if(err){ 
                res.json({
                  error:error
                });
                //req.flash('error',err); 
                //return res.redirect('/'); 
              } 
              //成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
              req.session.user = user; 
              res.json({
                success:success,
                user:user
              });
              //req.flash('success','注册成功!'); 
              //res.redirect('/show'); 
            }); 
        });
}


//书籍列表API
exports.booklist = function (req, res) {	
      Book.fetchAll(function(data){
      var books =[];
		  data.forEach(function (book, i) {
		    books.push({
		      id: book._id,
		      name: book.name,
		      pagenum: book.pagenum,
		      bookdesc: book.bookdesc,
		      bookface: book.bookface
		    });
		  });
		  res.json(books);
     });  
    };

//单个书籍API
exports.singleBook = function (req, res) { 
      var bookid=req.params.id; 
      Book.singleBook(bookid,function(err,book){
      if(book){
        res.json(book);
      }else{
        res.json({error: "未获得数据"});
      }
      
     });  
    };

exports.addMark = function (req, res) {
   var book={};
   book.name=req.body.name;
   book.bookface=req.body.bookface;
   book.pagenum=req.body.pagenum;
   book.bookdesc=req.body.bookdesc;

   //调用addMark函数
          Book.addMark(book,function(err, doc){
               if(err){
                   req.flash('error',err);
                   return res.redirect('/');
               }
               //如果成功存入，返回{"status": 1}给客户端
               res.send({"status": 1});
          })
};

exports.removeMark = function (req, res) {
   var id=req.params.id; 

          Book.removeMark(id,function(err, doc){
               if(err){
                  res.json({
                      msg:"系统出错"
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
   var host = 'http://book.douban.com/subject_search?search_text='+bookname;//可修改为其他的百科地址
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