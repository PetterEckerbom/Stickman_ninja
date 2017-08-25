var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');

});

router.get('/secret',function(req, res){
  if(req.session.user){
    res.render('secret');
    console.log(req.session.user);
  }else {
    res.redirect('/');
    console.log(req.session.user);
  }
});

module.exports = router;
