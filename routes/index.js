var express = require('express');
var router = express.Router();
var User = require('../models/user');
//renders index.pug when someone goes to url
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user;
  res.render('index');
});

router.get('/myprofile', function(req, res){
  res.locals.user = req.session.user;
  if(req.session.user){
    User.findOne({"username": req.session.user.username}).exec(function(err, user){
      if(err || !user){
        res.send("There was an error");
        return;
      }
      res.redirect('/ninjas/'+user.id);
    });
  }else{
    req.flash('error','You cannot view your profile befor you are logged in!');
    res.redirect('/');
  }
});

//simple way to make sure people can't access /game without being logged in
router.get('/game',function(req, res){
  res.locals.user = req.session.user;
  if(req.session.user){
    //if there is a logged in user we simply render game.pug
    res.render('game');
    console.log(req.session.user);
  }else {
    //if not we tell em they need to sign in and send them back to index.pug
    req.flash('error','You cannot join a game before you are logged in');
    res.redirect('/');
    console.log(req.session.user);
  }
});

module.exports = router;
