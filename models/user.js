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

UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}
const user = module.exports = mongoose.model('User', UserSchema);
