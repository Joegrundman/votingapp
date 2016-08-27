'use strict';
var bcrypt = require('bcrypt-nodejs')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	facebook: {
		id: String,
		token: String,
		email: String,
		username: String,
		displayName: String
	},
	local: {
		username: String,
		password: String
	}
});

User.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', User);
