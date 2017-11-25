var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/leaderboard',function(req, res){
    var leaderboard =[];
    User.find({}).sort({elo: -1}).exec(function (err, userQ) {
      console.log(userQ);
      for(var i in userQ){
       leaderboard.push({user:userQ[i].username, elo: userQ[i].elo});
        }
        res.render('leaderboard', {
          leaderboard: leaderboard
        });
     });
});

router.post('/search', function(req, res){
  var username = req.body.ninja;
  User.findOne({"username": username}).exec(function(err, user){
    if(err || !user){
      res.send('No ninja with the name: ' + username);
      return;
    }
    res.redirect('/ninjas/'+user.id);
  });
});


router.get('/:id', function(req, res){
 User.findById(req.params.id, function(err, user){
   if(err){
     res.send("no such user!");
     return;
   }
   var foo = new Date(user.date);
   var temp_result = "<b>Username: </b>"+user.username + "<br><br><b>Elo: </b>" + user.elo + "<br><br><b>Wins/Losses:</b> "+user.Wins+"/"+user.Losses+"<br><br> <b>Joined: </b>"+foo.toDateString();
   res.send(temp_result);
 });
});
module.exports = router;
