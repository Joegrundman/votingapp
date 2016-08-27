'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
			
		}
	}


	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/views/index.html');
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

	app.route('/api/:id')
		.get(function (req, res) {
			if (req.user) {
				console.log(req.user)
				// if(req.user.facebook) {
				// 	return res.json(req.user.facebook);
				// } else {
				// 	return res.json({username: req.user.local.username})
				// }
				res.json(req.user)
			} else {
				res.json({})
			}

		});

	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/'
		}));


	app.route('/auth/signup')
		.get(passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/',
			failureFlash: true
		}))

	app.route('/auth/login')
		.get(passport.authenticate('local-login', {
			successRedirect: '/',
			failureRedirect: '/',
			failureFlash: true
		}))

	app.route('/poll/:polltitle')
		.get(pollHandler.getOnePoll)

   app.route('/polldata/:polltitle')
		.get(pollHandler.getSinglePollData)

	app.route('/newpoll')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/views/newpoll.html');
		})
		.post(isLoggedIn, pollHandler.addNewPoll);

	app.route('/delPoll/:title')
		.post(isLoggedIn, pollHandler.deletePoll);

	app.route('/toggleClosePoll/:title')
		.post(isLoggedIn, pollHandler.toggleClosePoll);


	app.route('/addField/:title/:newField')
		.post(pollHandler.addFieldToPoll)

	app.route('/allpolls')
		.get(pollHandler.getPolls);

	app.route('/usersPolls')
		.get(isLoggedIn, pollHandler.getUsersPolls);

	app.route('/vote/:pollTitle/:id')
		.get(pollHandler.upVote)
};
