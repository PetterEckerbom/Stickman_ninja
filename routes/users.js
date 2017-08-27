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
  var password2 = req.body.password2;
  if(username.length < 6){
    req.flash('error','Username must be atleast 6 characters long');
    res.redirect('/users/register');
    return
  }
  if(validateEmail(email) == false){
    req.flash('error','Please enter a valid email');
    res.redirect('/users/register');
    return
  }
  if(password != password2){
    req.flash('error','Password doesnt match');
    res.redirect('/users/register');
    return
  }
  var found = false;
  User.findOne({username: username}, function(err, user) {
    if(err){
      res.send("error");
      res.redirect('/users/register');
      return false
    }
    if(user){
      req.flash('error','Name already taken');
      res.redirect('/users/register');
      return
    }else{
      User.findOne({email: email}, function(err, user) {
        if(err){
          res.send("error");
          res.redirect('/users/register');
          return false
        }
        if(user){
          req.flash('error','That email has already been used to register');
          res.redirect('/users/register');
          return
        }else{
            var newUser = new User({
              username:username,
              email:email,
              password:password,
              elo:0
            });
            newUser.password = newUser.generateHash(password);
          newUser.save(function(err){
                  if(err){
                    console.log(err);
                    return;
                  } else{
                    req.flash('Success','Your account has been created, you can now login');
                    res.redirect('/')
                    console.log("account created")
                  }
                });
        }
      });
    }
  });
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

router.post('/login', function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}, function(err, user) {
    if(err){
      res.send("error");
      res.redirect('/register');
    }
    if(!user){
      req.session.user = null;
      req.flash('error','There is no user with that name. You can register new account here <a href="register">here</a>');
      res.redirect('/users/login');
    }else{
      if(user.validPassword(password)){
        req.session.user = user;
        req.flash('Success','You are now logged in as '+user.username);
        res.redirect('/');
      }else{
        req.flash('error','That seems to be the wrong password');
        res.redirect('/users/login');
      }
    }
  });
});
 router.get('/logout',function(req,res){
   req.session.user = null;
   res.redirect('/');
 })
module.exports = router;
