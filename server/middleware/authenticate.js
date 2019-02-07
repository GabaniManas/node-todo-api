var {User} = require('./../models/user');

var authenticate = (req,res,next)=>{
	var token=req.header('x-auth');
	User.findByToken(token).then((user)=>{
		if(!user){
			return Promise.reject();
			// res.status(401).send()
		}
		// res.send(user);
		// console.log('OK');
		req.user = user;
		req.token = token;
		next();
	},(e)=>{
		console.log('Error :(',e);
		res.status(401).send('Authentication rejected');
	});
};

module.exports = {authenticate};