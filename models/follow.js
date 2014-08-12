var mongoose = require('mongoose');
exports.FollowSchema=new mongoose.Schema({ 
          name: String,
          password: String,
          email:String,
          imgUrl:String,
          follows:[exports.UserSchema]
        });