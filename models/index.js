// --- Initialise Mongoose Schema ---
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- User Schema ---
const userSchema = new Schema({
	name : String,
	username : String,
	email : String,
	password : String
});

// --- Post Schema ---
const postSchema = new Schema({
	user : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	text : String,
	comments : [{
		user : {
			type : Schema.Types.ObjectId,
			ref : 'User'
		},
		text : String
	}],
	date : {
		type : Date,
		default : Date.now
	}
});

// --- Configure Models ---
const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

/* Mongoose Model, where 'User' is the singular name of the MongoDB collection
and userSchema is the Schema to be compiled. Mongoose automatically looks for,
or creates, the plural version of your model name. In this case we have assigned
the compilation to a variable named User. */
