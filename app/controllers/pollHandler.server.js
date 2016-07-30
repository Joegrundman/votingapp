'use strict';

var Poll = require('../models/polls')
var path = process.cwd();

function PollHandler () {

   this.addFieldToPoll = function(req, res) {
         var urlData = decodeURI(req.url).replace('/addField/', '').split('/')
         var title = decodeURIComponent(urlData[0]);
         var newField = {"name": decodeURIComponent(urlData[1]), "votes": 0}

         Poll.findOne({ title: title}, function(err, poll) {
               if(err) throw err;
               poll.fields.push(newField);
               poll.save(function(err, data) {
                     if(err) throw err;
                     var responseData = {
                           title: title,
                           newField: data.fields.filter(f => f.name == newField.name )[0]
                     }
                      res.json(JSON.stringify(responseData))
               })
         })
   }


   this.addPoll = function(req, res) {
      var polldata = req.body
      var title = polldata.polltitle
      var fields = []
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

            poll.save(function(err) {
               if(err) {
                  throw err
               }
               console.log('successfully saved new poll')
               res.sendFile(path + '/public/index.html')
            })
         }

      })
   }

   this.getPolls = function (req,res) {
      Poll.find({}, function(err, doc) {
         if (err) throw err;
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

   this.upVote = function(req, res) {      
      var parsedUrl = req.url.replace(/\/vote\//, "").split("/")
      var poll = decodeURIComponent(parsedUrl[0]) 
      var field = decodeURIComponent(parsedUrl[1]) 
      Poll.findOne({title: poll}, function(err, doc){
         if(err) throw err;

         var retrievedField = doc.fields.filter(function(f){ return f._id == field})[0]
         retrievedField.votes++
         doc.save(function(err) {
            if(err) throw err;

            var updateInfo = {
                  id: retrievedField._id,
                  votes: retrievedField.votes
            }
            res.json(JSON.stringify(updateInfo))
         })
      })

   }

}

module.exports = PollHandler;


