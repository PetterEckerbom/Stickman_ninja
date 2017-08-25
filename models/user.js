const mongoose = require('mongoose');

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

const user = module.exports = mongoose.model('User', UserSchema);
