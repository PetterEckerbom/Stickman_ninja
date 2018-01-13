var express = require('express');
var router = express.Router();
//brings User model including schema and encryption and stuff
var User = require('../models/user');

//These just render appropriate PUG templete when get request is sent
router.get('/register',function(req,res){
  res.locals.user = req.session.user;
  res.render('register');
});
router.get('/login',function(req,res){
  res.locals.user = req.session.user;
  res.render('login');
});
//Register below
router.post('/register', function(req, res){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  //checks if username is to short.
  if(username.length < 4){
    req.flash('error','Username must be at least 4 characters long and can be at most 15 characters long');
    res.redirect('/users/register');
    return;
  }
  if(username.length > 15){
    req.flash('error','Username must be at least 4 characters long and can be at most 15 characters long');
    res.redirect('/users/register');
    return;
  }
  //checks if email is actually a email
  if(validateEmail(email) == false){
    req.flash('error','Please enter a valid email');
    res.redirect('/users/register');
    return;
  }
  if(/^[0-9a-zA-Z]+$/.test(username) == false){
    req.flash('error','Username contains illegal characters, only letters from a-z and numbers from 0-9 are allowed');
    res.redirect('/users/register');
    return;
  }
  if(/<[a-z][\s\S]*>/i.test(username)){
    req.flash('error','Please do not use html elements in username!');
    res.redirect('/users/register');
    return;
  }
  //makes sure password match
  if(password != password2){
    req.flash('error',"Password doesn't match");
    res.redirect('/users/register');
    return;
  }
  if(password.length < 5){
    req.flash('error','Password is not long enough');
    res.redirect('/users/register');
    return;
  }
  if(password.length > 4000){
    req.flash('error','Password is to long');
    res.redirect('/users/register');
    return;
  }
  if(email.length > 1000){
    req.flash('error','Email is to long');
    res.redirect('/users/register');
    return;
  }
  //checks if there is a user with the same username
  User.findOne({username: username}, function(err, user) {
    if(err){
      req.flash('error','There was an error! Please contact support!');
      res.redirect('/users/register');
      return false;
    }
    if(user){
      //if there is we just kinda end it here and ask user to pick new name
      req.flash('error','Name already taken');
      res.redirect('/users/register');
      return;
    }else{
      //If we dont find user with same name we make last check to make sure
      //email is not already in use
      User.findOne({email: email}, function(err, user) {
        if(err){
          req.flash('error','There was an error! Please contact support!');
          res.redirect('/users/register');
          return false;
        }
        if(user){
          //We tell user email already is used and return function once again
          req.flash('error','That email has already been used to register');
          res.redirect('/users/register');
          return;
        }else{
          //if all checks go through we create a new user with elo of 0
            var newUser = new User({
              username:username,
              email:email,
              password:password,
              elo:50,
              Wins:0,
              Losses:0,
              date:new Date()
            });
            //we genereate a hash representing password with "bcrypt" from function
            //in the models.js file, this is to make sure passwords are not saved in plane text
            newUser.password = newUser.generateHash(password);
            //We save account to database
          newUser.save(function(err){
                  if(err){
                    console.log(err);
                    return;
                  } else{
                    //Notify user of their accounts successful creation and send them to index
                    req.flash('Success','Your account has been created, you can now login');
                    res.redirect('/');
                    console.log("account created");
                  }
                });
        }
      });
    }
  });
});

//This is a function I stile from stackoverflow that checks if email is valid, guess it uses regex?
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//Function on a login request
router.post('/login', function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  //looks for a user with given username
  User.findOne({username: username}, function(err, user) {
    if(err){
      req.session.user = null;
      req.flash('error','There was an error! Please contact support!');
      res.redirect('/users/login');
    }
    if(!user){
      //if theres no user with given username we tell the client so and point them to /users/register
      req.session.user = null;
      req.flash('error','There is no user with that name. You can register new account here <a href="register">here</a>');
      res.redirect('/users/login');
    }else{
      //if there is we run validPassword password function (written in models.js file) that compares password to hashed passowrd
      if(user.validPassword(password)){
        //If password match we save user in session and tell client we have successfully singed them in
        req.session.user = user;
        req.flash('Success','You are now logged in as '+user.username);
        res.locals.user = user;
        res.redirect('/');
      }else{
        //If password is wrong we tell the client so and reloads page
        req.flash('error','That seems to be the wrong password');
        res.redirect('/users/login');
      }
    }
  });
});

//simple function that run on get request (someone told me it is more robust for this kinda stuff than post)
 router.get('/logout',function(req,res){
   //removes any possible user saved in seesion and sends user to index page
   req.session.user = null;
   req.flash('Success','You are now logged out!');
   res.redirect('/');
 });

module.exports = router;
