var mongodb = require('./db');

function User(user){ 
  //注册用户需要的信息name,password,email等
  this.name = user.name; 
  this.password = user.password; 
  this.email = user.email; 
 //用户在后面能保存更新的一些信息
  this.imgUrl=user.imgUrl;
}; 

module.exports = User; 

User.prototype.save=function(callback){ 
 //callback 是执行保存后的回调函数
  var user = { 
      name: this.name, 
      password: this.password, 
      email: this.email,
      //下面内容在注册时不用填，在个人档案可以修改，所以先设置默认值和默认头像
      imgUrl:"./public/images/11.jpg"
  }; 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('user',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
       //插入新的数据
      collection.insert(user,{safe: true},function(err,result){ 
        //不管是否成功都关闭数据库
        mongodb.close(); 
        //如果错误err有错误信息，将err和user返回给回调函数
        callback(err, user);//成功！返回插入的用户信息 
      }); 
    }); 
  }) 
}

//读取用户信息 
User.get = function(name, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 users 集合 
    db.collection('user', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 name 值为 name文档 
      collection.findOne({name: name},function(err, doc){ 
        mongodb.close(); 
        if(doc){ 
          var user = new User(doc); 
          callback(err, user);//成功！返回查询的用户信息 
        } else { 
          callback(err, null);//失败！返回null 
        } 
      }); 
    }); 
  }); 
};