'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	facebook: {
		id: String,
		token: String,
		email: String,
		username: String,
		displayName: String
	}
});

module.exports = mongoose.model('User', User);
