const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
//user schema
const UserSchema = mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  elo:{
    type:Number,
    required:true
  }
});
//Creates a encrypted password for a given user oppon being called.
//salt is set to 9, not to complex but should be enough for this application
//used when registering
UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
//compares the saved password-hash of a user to the password-hash of a given password, returns true/false.
//used when logging in
UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
//makes sure other files can access the Schema
const user = module.exports = mongoose.model('User', UserSchema);
