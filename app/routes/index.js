'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
			
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	app.route('/newpoll')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/newpoll.html');
		})
		.post(isLoggedIn, pollHandler.addPoll);

	app.route('/delPoll/:title')
		.post(isLoggedIn, pollHandler.deletePoll);

	// app.route('/addField/:title')
	// 	.post(isLoggedIn, pollHandler.addFieldToPoll);
		app.route('/addField/:title/:newField')
		.post(isLoggedIn, pollHandler.addFieldToPoll)

	app.route('/allpolls')
		.get(isLoggedIn, pollHandler.getPolls);

	app.route('/vote/:pollTitle/:id')
		.get(isLoggedIn, pollHandler.upVote)
};
