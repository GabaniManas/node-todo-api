const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users=[{
	_id:userOneId,
	email:'andrew@example.com',
	password:'userOnePass',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id: userOneId,access:'auth'},process.env.JWT_SECRET).toString()
	}]
},{
	_id:userTwoId,
	email:'john@example.com',
	password:'userTwoPass',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id: userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
	_id:new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
	},{
	_id:new ObjectID(),
	text: 'Second test todo',
	completed : true,
	completedAt : 123,
	_creator:userTwoId
}];

const populateTodos=(done)=>{
	// Todo.remove({}).then(()=>done());
	Todo.remove({}).then(()=>{
		// var todoOne = new Todo(todos[0]).save();
		// var todoTwo = new Todo(todos[1]).save();

		// return Promise.all([todoOne,todoTwo]);
			Todo.insertMany(todos);
			done();
	});
}

const populateUsers = (done)=>{
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		Promise.all([userOne,userTwo]);
		done();
	});
};

module.exports = {todos,populateTodos,users,populateUsers};