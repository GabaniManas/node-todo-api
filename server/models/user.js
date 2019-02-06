var mongoose = require('mongoose');

// email -require it - trim it - set type -set min length of 1
// have a look at mongoose schema and mongoose validation

var User=mongoose.model('Users',{
	email:{
		type: String,
		required: true,
		minLength: 1,
		trim: true
	}
});

module.exports = {User};