const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB Server.');
	}
	console.log('Connected to MongoDB Server');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5c5960934942ba00e4501e56')
	// },{
	// 	$set:{
	// 		completed: false
	// 	}
	// },{
	// 	returnOriginal: false
	// }).then((result)=>{
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5c596d9eef86420fd0109102')
	},{
		$set:{
			location: 'New York'
		},
		$inc:{
			age:1
		}
	},{
		returnOriginal: false
	}).then((result)=>{
		console.log(result);
	});

	db.close();
});