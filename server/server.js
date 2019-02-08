require('./config/config.js')

const _ = require('lodash');
const express = require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app=express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // use middleWare

app.post('/todos',authenticate,(req,res)=>{
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc)=>{
		res.send(doc);
	},(err)=>{
		res.status(400).send(err);
	});
});

//GET /todos/abc123
app.get('/todos',authenticate,(req,res)=>{
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{
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
app.get('/todos/:id',authenticate,(req,res)=>{
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
		Todo.findOne({
			_id:id,
			creator: req.user._id
		}).then((todo)=>{
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

app.delete('/todos/:id',authenticate,(req,res)=>{
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
		Todo.findOneAndRemove({
			_id:id,
			_creator:req.user._id
		}).then((todo)=>{
			if(!todo){
				return res.status(404).send('No such todo found'); // send({})
			}
			res.send({todo});
		},(e)=>{
			res.status(400).send({});
		});
	}
});

app.patch('/todos/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	var body =_.pick(req.body,['text','completed']);
	if(!ObjectID.isValid(id)){
		res.status(404).send('Key Invalid');
	}
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	Todo.findOneAndUpdate({_id:id,_creator:req.body._id},{$set:body},{new:true}).then((todo)=>{
		res.send({todo});
	},(e)=>{
		res.status(400).send('Unable to update');
	});

});

// POST/users

app.post('/users',(req,res)=>{
	// console.log(req.body);
	var body=_.pick(req.body,['email','password']);
	var user = new User(body);

	user.save().then(()=>{
		// res.send(user);
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).send(user);//custom header	
	},(err)=>{
		res.status(400).send(err);
	});
});

// Middleware

app.get('/users/me',authenticate,(req,res)=>{
	res.send(req.user);
	// var token=req.header('x-auth');
	// User.findByToken(token).then((user)=>{
	// 	if(!user){
	// 		return Promise.reject();
	// 		// res.status(401).send()
	// 	}
	// 	res.send(user);
	// },(e)=>{
	// 	res.status(401).send('Authentication rejected');
	// });
});

// POST /users/login {email,password}
app.post('/users/login',(req,res)=>{
	var body=_.pick(req.body,['email','password']);
	User.findByCredentials(body.email,body.password).then((user)=>{
		// res.send(user);
		return user.generateAuthToken().then((token)=>{
			res.header('x-auth',token).send(user);
		});
	}).catch((e)=>{
		res.status(400).send('Invalid password');
	});
});// no authenticate middleware as you do not have a token, you just requie a new one

app.delete('/users/me/token',authenticate,(req,res)=>{
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	},()=>{
		res.status(400).send();
	}); 
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