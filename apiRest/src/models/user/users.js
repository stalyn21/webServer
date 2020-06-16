const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const User = new Schema({
    usr:{name: {type: String, required:true}, lastname: {type: String, required:true}},
    email: {type: String, unique:true, lowercase: true, required: true}, //unique email, required and lowercase
    pwd: {type:String, select:true, required: true}, //security, to send the pwd to usrs
    permissionLevel: {type: Number, default: 3},
    //llevar un control de registro
    signupDate: {type: Date, default: Date.now()},
    lastLogin: Date
});
//userSchema
User.methods.encryptPassword = async (pwd) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
};

User.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.pwd);
};

module.exports = mongoose.model('users',User)