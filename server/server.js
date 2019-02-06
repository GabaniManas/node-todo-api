var express = require('express');
var bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app=express();

app.use(bodyParser.json()); // use middleWare

app.post('/todos',(req,res)=>{
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	});
});

//GET /todos/abc123

app.listen(3000,()=>{
	console.log('Started on 3000');
});























//save new something
/*


var newTodo = new Todo({
	text: 'Feeding the dog'
});

newTodo.save().then((doc)=>{
	console.log(JSON.stringify(doc,undefined,2));
},(err)=>{
	console.log('Unable to save todo');
}); // save() returns a promise
*/
//User

/*
var newUser = new User({
	email:  '     abc@xyz.com      '
});

newUser.save().then((doc)=>{
	console.log(JSON.stringify(doc,undefined,2));
},(err)=>{
	console.log('Unable to add user',err);
});
*/