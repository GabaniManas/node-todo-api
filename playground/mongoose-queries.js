const {ObjectID}=require('mongodb');

const {mongoose} =require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');

var id='5c5abf2d98cc151d9c6ad2251';

if(!ObjectID.isValid(id)){
	console.log('Id is not valid');
} else {
	// Todo.find({
	// 	completed : false
	// }).then((todos)=>{
	// 	console.log('Your Todos',todos);
	// },(e)=>{
	// 	console.log('Unable to retrive todos',e);
	// });

	Todo.findOne({
		_id:id
	}).then((todo)=>{
		console.log('Your Todo',todo);
	}).catch((e)=>console.log(e));

	Todo.findById(id).then((todo)=>{
		if(!todo){
			return console.log('ID not found.');
		}
		console.log('Your Todo',todo);
	},(e)=>{
		console.log('Unable to retrive todos',e);
	});	
}

User.find({
	email:'abc@xyz.com'
}).then((res)=>{
	if(res.length === 0){
		return console.log('No such user found');
	}
	console.log(JSON.stringify(res));
},(e)=>{
	console.log('Unable to retrive the user',e);
});

User.findById('5c5ac41dc415923dfda94bb3').then((res)=>{
	if(!res){
		return console.log('No such user found');
	}
	console.log(res);
}).catch((e)=>{
	console.log('Unable to retrive the user',e);
});
