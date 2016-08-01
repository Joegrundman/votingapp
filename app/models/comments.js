'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
   commentBody: String,
   author: String
})

module.exports = mongoose.model('Comment', Comment)