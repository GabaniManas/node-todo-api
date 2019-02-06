const {ObjectID}=require('mongodb');

const {mongoose} =require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');

// remove - deletes all the matching documents
// remove({}) - deletes all the documents in the collection

// Todo.remove({}).then((res)=>{
// 	console.log(res);
// });

// findOneAndRemove - deletes the first match
// Todo.findOneAndRemove({
// 	text:'Something to do'
// }).then((res)=>{
// 	if(!res){
// 		return console.log('No such todo found.');
// 	} 	
// 	console.log(res);
// },(e)=>{
// 	console.log('Unable to remove the todo',e);
// });

//findByIdAndRemove - deletes the document with given ID
Todo.findByIdAndRemove('5c5afcc7e415fc2034aef1f5').then((res)=>{
	if(!res){
		return console.log('No such todo found.');
	}
	console.log(res);
},(e)=>{
	console.log('Unable to remove the todo',e);
});