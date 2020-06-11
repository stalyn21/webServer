const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs') //Encrypt pwd

const User = new Schema({
    usr:{name: {type: String, required:true}, lastname: {type: String, required:true}},
    email: {type: String, unique:true, lowercase: true, required: true}, //unique email, required and lowercase
    pwd: {type:String, select:false, required: true}, //security, to send the pwd to usrs
    permissionLevel: {type: Number, required:true},
    //llevar un control de registro
    signupDate: {type: Date, default: Date.now()},
    lastLogin: Date
})

//encrypt pwd
/*User.pre('save',(next)=>{
    let user =this
    if (!user.isModified('pwd')) return next()

    bcrypt.genSalt(10,(err,salt) => {
        if(err) return next(err)

        bcrypt.hash(user.pwd, salt, null,(err,hash) =>{
            if (err) return next(err)
            user.pwd = hash
            next()
        })
    })
})*/

module.exports = mongoose.model('users',User)