var mongoose = require('mongoose');
exports.MarkSchema=new mongoose.Schema({ 
          name: String,
          bookface: String,
          pagenum:String,
          bookdesc:String
        });

// var mongodb = require('./db');
// function Book(book){ 
//   this.name = book.name; 
//   this.bookface = book.bookface; 
//   this.pagenum = book.pagenum; 
//   this.bookdesc = book.bookdesc; 
// }; 
// module.exports = Book; 

// Book.removeMark=function(id,callback){
// 	mongodb.open(function(err,db){
// 		if(err){
// 			return callback(err);
// 		}
// 		db.collection('mbook',function(err,collection){
// 			if(err){
// 				mongodb.close();
// 				return callback(err);
// 			}
// 			collection.remove({"_id":parseInt(id)},{safe:true},function(err,result){
// 				mongodb.close();
// 				callback(err,id);
// 			})
// 		});

// 	});
// }
// Book.addMark=function(book,callback){
// 	mongodb.open(function(err,db){
// 		if(err){
// 			return callback(err);
// 		}
// 		var date = new Date(); //获取当前时间
// 	    var time = { 
// 	      date: date, 
// 	      year : date.getFullYear(), 
// 	      month : date.getFullYear() + "-" + (date.getMonth()+1), 
// 	      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(), 
// 	      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() 
// 	    } 
// 	    book.time=time; 

// 		    db.collection('mbook',function(err,collection){ //存入mbook表中
// 		      if(err){ 
// 		        mongodb.close(); 
// 		        return callback(err); 
// 		      } 
// 			  collection.find().sort({time:-1}).toArray(function(err,items){//按照添加时间查找，查找最近的一个
// 		        var ids=0;
// 		        if(items.length==0){ //如果没有，就从0 开始
// 		          ids=0; 
// 		        }else{ 
// 		          ids=items[0]._id;  //如果有，就获取到最近一个的id值，然后+1
// 		          ids++;   
// 		        } 
// 		        book._id=ids;
// 		        collection.insert(book,{safe: true},function(err,result){ 
// 			          mongodb.close(); 
// 			          callback(err, book);
// 		        }); 
// 			  });
		      
			 
// 		  });
// 	    });
// };
// Book.fetchAll=function(callback){
// 	mongodb.open(function(err, db){ 
//     if(err){ 
//       return callback(err); 
//     } 
//     //读取 mbook 集合 
//     db.collection('mbook', function(err, collection){ 
//       if(err){ 
//         mongodb.close(); 
//         return callback(err); 
//       } 
//       //查找用户名 name 值为 name文档 ,并且hide为true
//       collection.find().limit(20).sort({time:-1}).toArray(function(err,items){ 
//         if(err) throw err; 
//         if(items.length!=0){
//             mongodb.close();
//             return callback(items);
//           }else{//如果数据库没有内容
//             mongodb.close();
//             return callback(items);
//           }  
//       }); 
//     }); 
//   }); 
// };


// //读取用户信息 
// Book.singleBook = function(id, callback){ 
//   //打开数据库 
//   mongodb.open(function(err, db){ 
//     if(err){ 
//       return callback(err); 
//     } 
//     //读取 books 集合 
//     db.collection('mbook', function(err, collection){ 
//       if(err){ 
//         mongodb.close(); 
//         return callback(err); 
//       } 
//       //根据id查找
//       collection.findOne({_id:parseInt(id)},function(err, doc){ 
//         mongodb.close();
//         if(doc){ 
//           var book = new Book(doc); 
//           callback(err, book);//成功！返回查询的用户信息 
//         } else { 
//           callback(err, null);//失败！返回null 
//         } 
//       }); 
//     }); 
//   }); 
// };
