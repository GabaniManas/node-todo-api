const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server.');
	}
	console.log('Connected to MongoDB Server');

	//deleteMany
	// db.collection('Users').deleteMany({name:'Bob Evans'}).then((result)=>{
	// 	console.log(result);
	// });

	//deleteOne
	// db.collection('Users').deleteOne({age: 20}).then((result)=>{
	// 	console.log(result);
	// });

	//findeOneAndDelete
	db.collection('Users').findOneAndDelete({location:'anand'}).then((result)=>{
		console.log(result);
	});

	db.close();
}); 