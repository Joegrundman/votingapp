'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
   title: {type: String, unique: true},
   fields: [{name: String, votes: Number}],
   votedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
   author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
})

module.exports = mongoose.model('Poll', Poll);