var mongoose = require('mongoose');
exports.FollowSchema=new mongoose.Schema({ 
          email:String,
          follow:[exports.UserSchema]
        });