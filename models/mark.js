var mongoose = require('mongoose'),Schema=mongoose.Schema;
exports.MarkSchema=new mongoose.Schema({ 
	      user:String,
          name: String,
          bookface: String,
          pagenum:String,
          bookdesc:String,
          date:Date,
          comment:[{
          	owner:{ type: Schema.Types.ObjectId, ref: 'User' },
          	content:{type :String}
          }]
        });
var User = mongoose.model('User', exports.UserSchema); 

