var express = require('express');
var router = express.Router();

//renders index.pug when someone goes to url
router.get('/', function(req, res, next) {
  res.render('index');
});

//simple way to make sure people can't access /game without being logged in
router.get('/game',function(req, res){
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
