var mongoose = require('mongoose'),Schema=mongoose.Schema;
exports.MarkSchema=new mongoose.Schema({ 
	      user:String,
          name: String,
          bookface: String,
          pagenum:String,
          bookdesc:String,
          date:Date,
          comment:[{
          	owner:{ type: String },
          	content:{type :String}
          }]
        });
var User = mongoose.model('User', exports.UserSchema); 

