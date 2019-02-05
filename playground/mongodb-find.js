const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server.');
	}
	console.log('Connected to MongoDB Server');

	// db.collection('Todos').find({
	// 	_id:new ObjectID('5c5960934942ba00e4501e56')
	// }).toArray().then((docs)=>{
	// 	console.log('Your Todos');
	// 	console.log(JSON.stringify(docs,undefined,2));	
	// },(err)=>{
	// 	console.log('Unable to fetch todos',err);
	// }); // find()-return mongoDB cursors , toArray()-return a Promise , arguments to find() are queries

	// db.collection('Todos').find().count().then((count)=>{
	// 	console.log(`Todos count: ${count}`);
	// },(err)=>{
	// 	console.log('Unable to fetch todos',err);
	// });	

	db.collection('Users').find({name:'Bob Evans'}).toArray().then((docs)=>{
		console.log('Documents with given name');
		console.log(JSON.stringify(docs,undefined,2));
	},(err)=>{
		console.log('Unable to find such document.',err);
	});

	db.close();
});  