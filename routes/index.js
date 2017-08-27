var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/game',function(req, res){
  if(req.session.user){
    res.render('game');
    console.log(req.session.user);
  }else {
    req.flash('error','You cannot join a game before you are logged in');
    res.redirect('/');
    console.log(req.session.user);
  }
});

module.exports = router;
