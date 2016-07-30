'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
   title: {type: String, unique: true},
   fields: [{name: String, votes: Number}],
   votedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Poll', Poll);