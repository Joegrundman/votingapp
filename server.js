'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash')
var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();
if(process.env.NODE_ENV == 'development') {
	console.log('running in development mode')
	require('dotenv').load()
}

require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/views', express.static(process.cwd() + '/public/views'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: process.env.CLEMENTINE_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});