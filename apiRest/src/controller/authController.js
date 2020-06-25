const User = require('../models/user/users');
const bcrypt = require('bcrypt');
const CONFIG = require('../config');

const jwt = require('jsonwebtoken');

//Username
//Password

async function login(req,res){

    await User.findOne({email: req.body.email})
    .then(user => {
        if(!user) return res.status(404).send({message: 'User is not found'});
        bcrypt.compare(req.body.pwd, user.pwd)
            .then(match => {
                if(match){
                    payload = {
                        user: {name: user.name, lastname: user.lastname},
                        email: user.email,
                        permissionLevel: user.permissionLevel
                    }
                    //Allow permission
                    jwt.sign(payload,CONFIG.secret,async function(err, token){
                        if(err){
                            res.status(500).send({err});
                        }
                        else{
                            res.status(200).send({message: 'Allow access', token});
                        }
                    })
                }
                else{
                    //Denied permission
                    res.status(200).send({message: 'Incorrect Password'});
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send({err});
        });
    })
}

module.exports = login;