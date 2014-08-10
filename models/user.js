var mongoose = require('mongoose');
exports.UserSchema=new mongoose.Schema({ 
          name: String,
          password: String,
          email:String,
          imgUrl:String,
          follows:[exports.UserSchema]
        });