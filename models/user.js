var mongoose = require('mongoose')
    ,Schema=mongoose.Schema;
exports.UserSchema=new mongoose.Schema({ 
          name: String,
          password: String,
          email:String,
          imgUrl:String,
          followings:[{ type: Schema.Types.ObjectId, ref: 'User' }]
        });
var User = mongoose.model('User', exports.UserSchema); 
