// const MongoClient = require('mongodb').MongoClient;

// var user={name:'manas',age:20};
// var {name}=user;
// console.log(name); // object destructuring

const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server.');
	}
	console.log('Connected to MongoDB Server');
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// },(err,result)=>{
	// 	if(err){
	// 		return console.log('Unable to insert todo',err);
	// 	}
	// 	console.log(JSON.stringify(result.ops,undefined,2));
	// }); //to insert new Document

	//Insert new doc into Users (name,age,location)
	// db.collection('Users').insertOne({
	// 	// _id : 1,
	// 	name : 'Bob Evans',
	// 	age : 25,
	// 	location : 'Las Vegas'
	// },(err,result)=>{
	// 	if(err){
	// 		return console.log('Unable to add user',err);
	// 	}
	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
	// });

	db.close();
});  //two args: 1-url where database lives(AWS/Heroku) 2-callback function 