const express = require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app=express();
const port = process.env.PORT || 3000;

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

app.post('/users',(req,res)=>{
	// console.log(req.body);
	var user = new User({
		email: req.body.email
	});

	user.save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	});
});

//GET /todos/abc123
app.get('/todos',(req,res)=>{
	Todo.find().then((todos)=>{
		res.send(todos);
	},(e)=>{
		res.status(400).send(e);
	});
});

app.get('/users',(req,res)=>{
	User.find().then((todos)=>{
		res.send({todos});
	},(e)=>{
		res.status(400).send(e);
	});
});

// GET/todos/123456 - someid to be queried
app.get('/todos/:id',(req,res)=>{
	// res.send(req.params);//req.params is an object with key-value pair where key is the url parameter and the value is the actual value in the url
	var id=req.params.id;
	// valid id using isValid
		// 404 - send back empty send
	// findById
		// success
			// if todo - send it back
			// if no todo - send back 404 with empty body
		// error
			// 400 - and send empty body back
	if(ObjectID.isValid(id)){
		Todo.findById(id).then((todo)=>{
			if(!todo){
				return res.status(404).send('No such todo found'); // send({})
			}
			res.send({todo});
		},(e)=>{
			res.status(400).send({});
		});
	} else {
		res.status(404).send('Key Invalid'); // send({})
	}
});

app.delete('/todos/:id',(req,res)=>{
	// get the id
	// validate the id , if not valid .. return 404
	// remove todo by id
		// success
			// if no document, send 404
			// if document, send document back with 200
		// error
			// 400 with empty body
	var id=req.params.id;
	if(!ObjectID.isValid(id)){
		res.status(404).send('Key Invalid');
	} else {
		Todo.findByIdAndRemove(id).then((todo)=>{
			if(!todo){
				return res.status(404).send('No such todo found'); // send({})
			}
			res.send({todo});
		},(e)=>{
			res.status(400).send({});
		});
	}
});

app.listen(port,()=>{
	console.log(`Started on port ${port}`);
});

module.exports = {app};























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