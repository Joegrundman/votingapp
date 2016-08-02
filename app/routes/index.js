'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
			
		}
	}


	var pollHandler = new PollHandler();

	// app.route('/')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.sendFile(path + '/public/views/index.html');
	// 	});
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/views/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/views/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/views/profile.html');
		});

	// app.route('/api/:id')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.json(req.user.github);
	// 	});

	app.route('/api/:id')
		.get(function (req, res) {
			if(req.user) {
				res.json(req.user.github);
			} else {
				res.json({})
			}

		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	// app.route('/poll/:polltitle')
	// 	.get(isLoggedIn, pollHandler.getOnePoll)

	app.route('/poll/:polltitle')
		.get(pollHandler.getOnePoll)


	app.route('/newpoll')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/views/newpoll.html');
		})
		.post(isLoggedIn, pollHandler.addPoll);

	app.route('/delPoll/:title')
		.post(isLoggedIn, pollHandler.deletePoll);

	// app.route('/addField/:title/:newField')
	// 	.post(isLoggedIn, pollHandler.addFieldToPoll)


	app.route('/addField/:title/:newField')
		.post(pollHandler.addFieldToPoll)


	// app.route('/allpolls')
	// 	.get(isLoggedIn, pollHandler.getPolls);
	app.route('/allpolls')
		.get(pollHandler.getPolls);

	app.route('/usersPolls')
		.get(isLoggedIn, pollHandler.getUsersPolls);

	// app.route('/vote/:pollTitle/:id')
	// 	.get(isLoggedIn, pollHandler.upVote)

	app.route('/vote/:pollTitle/:id')
		.get(pollHandler.upVote)
};
