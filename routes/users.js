var express = require('express');
var router = express.Router();

let User = require('../models/user');

router.get('/register',function(req,res){
  res.render('register');
});
router.get('/login',function(req,res){
  res.render('login');
});

router.post('/register', function(req, res){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  let newUser = new User({
    username:username,
    email:email,
    password:password,
    elo:-10
  });
  newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else{
            res.redirect('/')
            console.log("account created")
          }
        });
});

router.post('/login', function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username, password:password}, function(err, user) {
    if(err){
      res.send("error");
      res.redirect('/register');
    }
    if(!user){
      req.session.user = null;
      res.redirect('/users/register');
    }else{
      req.session.user = user;
      res.redirect('/');
    }
  });
});
 router.get('/logout',function(req,res){
   req.session.user = null;
   res.redirect('/');
 })
module.exports = router;
