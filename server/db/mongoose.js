var mongoose = require('mongoose');

mongoose.Promise=global.Promise; 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports={mongoose};

// process.env.NODE_ENV === 'production' // by default .. app in heroku
// process.env.NODE_ENV === 'development' // running app locally
// process.env.NODE_ENV === 'test' // running through mocha 