const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// email -require it - trim it - set type -set min length of 1
// have a look at mongoose schema and mongoose validation

// {
// 	email: 'abc@xyz.com',
// 	password: 'sdgzdfjbekjfgdk',
// 	tokens:[{
// 		access: 'auth',
// 		token: 'sarmbjgkjgdfdbkj'
// 	}]
// }

var UserSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
		minLength: 1,
		trim: true,
		unique : true,
		validate:{
			// validator: (value)=>{
			// 	return validator.isEmail(value);
			// },
			validator: validator.isEmail,
			message: '{VALUE} is  not a valid email'
		},
	},
	password:{
		type :String,
		require: true,
		minlength: 6
	},
	tokens:[{
		access:{
			type:String,
			required:true
		},
		token:{
			type:String,
			required:true
		}
	}]
});
//overriding JSON method ... trimming the body 
UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject,['_id','email']);};


UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();

	user.tokens.push({access,token});

	return user.save().then(()=>{
		return token;
	});//.then((token)=>{

	// })  
	// chaining a promise
}; // as arrow funtion do not bind this keyword

UserSchema.statics.findByToken=function(token){
	var User = this;
	var decoded;

	try{
		console.log('Till here its great');
		decoded = jwt.verify(token,'abc123');
		console.log(decoded);
	} catch(e){
		// return new Promise((resolve,reject)=>{
		// 	reject();
		// });
		console.log('Here',e);
		return Promise.reject();
	}
	return User.findOne({
		'_id': decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});
};

UserSchema.statics.findByCredentials = function(email,password){
	var User = this;
	return User.findOne({email}).then((user)=>{
		if(!user){

		}
		return new Promise((resolve,reject)=>{
			// Use bcrypt.compare to compare password and user.password
			bcrypt.compare(password,user.password,(err,res)=>{
				if(res){
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.methods.removeToken = function(token){
	// $pull - lets you toremove items from array that match certain criteria
	var user = this;
	return user.update({
		$pull:{
			tokens:{token}
		}
	});
};

UserSchema.pre('save',function(next){
	var user=this;
	if (user.isModified('password')){
		// user.password
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password=hash;
				next();
			});
		});
		// user.password=hash
		// next();
	} else {
		next();
	}
});

var User=mongoose.model('Users',UserSchema);

// var User=mongoose.model('Users',{
// 	email:{
// 		type: String,
// 		required: true,
// 		minLength: 1,
// 		trim: true,
// 		unique : true,
// 		validate:{
// 			// validator: (value)=>{
// 			// 	return validator.isEmail(value);
// 			// },
// 			validator: validator.isEmail,
// 			message: '{VALUE} is  not a valid email'
// 		},
// 	},
// 	password:{
// 		type :String,
// 		require: true,
// 		minlength: 6
// 	},
// 	tokens:[{
// 		access:{
// 			type:String,
// 			required:true
// 		},
// 		token:{
// 			type:String,
// 			required:true
// 		}
// 	}]
// }); 

module.exports = {User};