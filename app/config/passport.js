'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			console.log('profile', profile)
			User.findOne({
				'facebook.id': profile.id
			}, function (err, user) {
				if(err) {
					console.log('error triggered')
					return done(err);
				}
				if(user){ 
					console.log('retrieved user')
					return done(null, user);
				} else {
					console.log('making new user')
					var newUser = new User();
					var username  = '';
					var displayName = '';
					if (profile.username) {
						username = profile.username;
					}
					if(profile.displayName) {
						displayName = profile.displayName;
					} else {
						displayName = profile.familyName + ' ' + profile.givenName
					}

					// set all of the facebook information in our user model
					newUser.facebook.id    = profile.id; // set the users facebook id                   
					newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
					newUser.facebook.username  = username;
					newUser.facebook.displayName = displayName;
					
					// save our user to the database
					newUser.save(function(err) {
						if (err)
								throw err;

						// if successful, return the new user
						return done(null, newUser);
					});
				}
			})
		})

	}
	))


};
