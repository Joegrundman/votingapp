'use strict';
var Poll = require('../models/polls')
var path = process.cwd();

function PollHandler () {

   this.addFieldToPoll = function(req, res) {
         var urlData = decodeURI(req.url).replace('/addField/', '').split('/')
         var title = decodeURIComponent(urlData[0]);
         var newField = decodeURIComponent(urlData[1])

         Poll.findOne({ title: title}, function(err, poll) {
               if(err) throw err;
               if (poll.fields.indexOf(newField) != -1) {
                     return res.json({"msg": "this option already exists"})
               }
               poll.fields.push({"name":newField, "votes": 0});
               poll.save(function(err, data) {
                     if(err) throw err;

                      res.json(JSON.stringify(data))
               })
         })
   }


   this.addNewPoll = function(req, res) {
      var polldata = req.body
      console.log(polldata)
      var title = polldata.polltitle
      var fields = []
      var userdata = req.user
      for (var prop in polldata) {
         if (prop != 'polltitle') {            
            fields.push({"name": polldata[prop], "votes": 0})
         }
      }

      Poll.findOne({ title: title },function(err,poll) {
         if (err) throw(err)
         if (poll) {
            console.log('already exists')
            return res.send()
         } 
         else {
            var poll = new Poll();
            poll.title = title;
            poll.fields = fields;
            poll.author = userdata._id
            
            poll.save(function(err, poll) {
               if(err) {
                  throw err
               }
               console.log('successfully saved new poll')

               res.json(poll)
            })
         }

      })
   }

   this.getPolls = function (req,res) {
      Poll.find().populate('author').exec(function(err, doc){
            if(err) throw err;
            var polls = doc.filter(function(poll) {return poll.title != undefined})
                           .filter(function(poll) { return poll.isClosed != true})
            res.json(polls)
      })
   }

   this.getUsersPolls = function (req, res) {
         var userId = req.user._id;
         Poll.find({author: {_id: userId}}).populate('author').exec(function(err, doc){
               if(err) throw err;
               var polls = doc.filter(function (poll) { return poll.title != undefined })
               res.json(polls)
         })
   }

   this.getOnePoll = function (req, res) {
         var title = decodeURIComponent(req.url.replace("/poll/", ""))
         Poll.findOne({title:title}).populate('author').exec(function(err, doc) {
               if(err) throw err;
            var pollTpl = require('../templates/polltpl')(doc, req.isAuthenticated())
            res.send(pollTpl)
         })
   }

   this.getSinglePollData = function(req, res) {
         var title = decodeURIComponent(req.url.replace("/polldata/", ""))
         Poll.findOne({ title: title}, function(err, doc){
               if(err) throw err;
               res.json(doc)
         })
   }

   this.deletePoll = function(req, res) { 
      var title = decodeURIComponent(req.url.replace("/delPoll/", ""))
      Poll.remove({title: title}, function(err, doc){
            if(err) throw err
            res.send();
      })
   }

   this.toggleClosePoll = function(req, res) { 
      var title = decodeURIComponent(req.url.replace("/toggleClosePoll/", ""))
      Poll.findOne({title: title}, function(err, doc){
            if(err) throw err
            if(doc.isClosed){
                  doc.isClosed = !doc.isClosed
            } else { doc.isClosed = true }
            doc.save(function (err, doc){
                  if(err) throw err
                  var msg = {
                        "poll": doc.title,
                        "isClosed": doc.isClosed
                  }
                  res.json(msg);
            })
      })
   }

   this.upVote = function(req, res) { 
      var ipAddress = req.ip.toString(); 
      var parsedUrl = req.url.replace(/\/vote\//, "").split("/")
      var poll = decodeURIComponent(parsedUrl[0]) 
      var field = decodeURIComponent(parsedUrl[1])
      console.log('poll:', poll, ' :: field:', field) 
      Poll.findOne({title: poll}, function(err, doc){
         if(err) throw err;
         if(doc.votedByIP.indexOf(ipAddress) != -1) {
               console.log('error already voted on' + decodeURI(req.url))
              return res.status(409).json({
                    msg: "you have already voted on this poll"
                  })
         }
         var retrievedField = doc.fields.filter(function(f){ return f.name == field})[0]
         console.log('retrieved field:', retrievedField)
         retrievedField.votes++
         if(doc.votedByIP.indexOf(ipAddress) == -1){
            doc.votedByIP.push(ipAddress)
         }

         doc.save(function(err) {
            if(err) throw err;

            res.json(JSON.stringify(doc))
         })
      })

   }

}

module.exports = PollHandler;


