const expect = require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id:new ObjectID(),
	text: 'First test todo'
},{
	_id:new ObjectID(),
	text: 'Second test todo',
	completed : true,
	completedAt : 123
}];

beforeEach((done)=>{
	// Todo.remove({}).then(()=>done());
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=>done());
});

describe('POST /todos',()=>{
	it('should create a new todo',(done)=>{
		var text = 'Test todo text';
		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res)=>{
			expect(res.body.text).toBe(text);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			// Todo.find().then((todos)=>{...})
			Todo.find({text}).then((todos)=>{
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((e)=>{
				done(e); 
			});
		});
	});

	it('should not create a todo with invalid body data',(done)=>{
		// var text='';
		request(app)
		.post('/todos')
		.send()
		.expect(400)
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			Todo.find().then((todos)=>{
				expect(todos.length).toBe(2);
				// expect(todos[0].text).toBe(text);
				done();
			}).catch((e)=>{
				done(e);
			});
		});
	});
});

describe('GET /todos',()=>{
	it('should get all todos',(done)=>{
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res)=>{
			expect(res.body.length).toBe(2);
		})
		.end(done);
	});
});

describe('GET /todos/:id',()=>{
	it('should return todo doc',(done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('should return 404 if id not found',(done)=>{
		var hexID =new ObjectID().toHexString();
		request(app)
		.get(`/todos/${hexID}`)
		.expect(404)
		// .expect((res)=>{
		// 	expect(res.body.todo.text).toBe(todos[0].text);
		// })
		.end(done);
	});

	it('should return 404 if id is not valid',(done)=>{
		request(app)
		.get('/todos/123abc')
		.expect(404)
		.end(done);
	});
});

describe('DELETE /todos/:id',()=>{
	it('should remove a todo',(done)=>{
		var hexID=todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexID}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo._id).toBe(hexID);
		})
		.end((err,res)=>{
			if(err){
				return done(err);
			}
			// query database using findById toNotExist
			// expect(null).toNotExist();
			Todo.findById(hexID).then((todo)=>{
				expect(todo).toNotExist();
				done();
			},(e)=>done(e));
		});
	});

	it('should return 404 if id is not found',(done)=>{
		var hexID =new ObjectID().toHexString();
		request(app)
		.delete(`/todos/${hexID}`)
		.expect(404)	
		.end(done);	
	});

	it('should return 404 if id is invalid',(done)=>{
		request(app)
		.delete('/todos/123abc')
		.expect(404)
		.end(done);
	});
});

describe('PATCH /todos/:id',()=>{
	it('should update the todo',(done)=>{
		// grab id of first item
		// update text ,set completed trur
		// status 200
		// text is changed, completed is true, completedAt is a number .toBeA()
		var hexID = todos[0]._id.toHexString();
		var text = 'This is the new task';
		request(app)
		.patch(`/todos/${hexID}`)
		.expect(200)
		.send({
			completed:true,
			text
		})
		.expect((res)=>{
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);
	});

	it('should clear completedAt when todo is not completed',(done)=>{
		// grab id of second item
		// update text, set completed to false
		// status 200
		// text is changed, completed false, completedAt is null .toNotExist()
		var hexID = todos[1]._id.toHexString();
		var text = 'This is another task';
		request(app)
		.patch(`/todos/${hexID}`)
		.expect(200)
		.send({
			completed:false,
			text
		})
		.expect((res)=>{
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
		})
		.end(done);
	});
});