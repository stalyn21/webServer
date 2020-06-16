const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//const mongoose = require ('mongoose')
const r = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('../routes/verifyAuth');
const Usr = require('../models/user/users');

const jsonParser = bodyParser.json();

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Pages
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

r.post('/sigin', async (req, res) => {
  console.log('POST request ....... User sigin');
  const user = await Usr.findOne({email: req.body.email});
  if(!user) {
      return res.status(404).send("The email doesn't exists");
  }
  const validPassword = await user.comparePassword(req.body.pwd, user.pwd);
  if (!validPassword) {
      return res.status(401).send({message:'Incorrect password', auth: false, token: null});
  }
  const token = jwt.sign({id: user._id}, config.secret, {
      expiresIn: 60 * 60 * 24
  });
  res.status(200).json({message:'Welcome to the dark! ' ,auth: true, token});
});


r.get('/ours',verifyToken , async (req, res) => {
  console.log('GET request ....... About ours');
  //res.json('Welcome!');
  // res.status(200).send(decoded);
  // Search the Info base on the ID
  // const user = await User.findById(decoded.id, { password: 0});
  const user = await Usr.findById(req.userId, { pwd: 0});
  if (!user) {
      return res.status(404).send("No user found.");
  }
  res.status(200).json(user);
});

r.get('/logout', function(req, res) {
  console.log('GET request ....... User logout');
  res.status(200).send({ message:'Thanks a lot!', auth: false, token: null });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//insert, update, delete, search
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Getting all
r.get('/', async (req, res) => {
  try {
    console.log('Get request ....... Find all');
    const usrs = await Usr.find();
    res.json(usrs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// Getting One
r.get('/:id', getUser, (req, res) => {
  console.log('Get request ....... Find one');
  res.json(res.users)
});

// Creating one
r.post('/register',jsonParser,async (req, res) => {
  console.log('Post request ....... Add user');
  const users = new Usr(
    {
      usr : {name : req.body.usr.name , lastname : req.body.usr.lastname},
      email : req.body.email,
      pwd : req.body.pwd,   
      permissionLevel: req.body.permissionLevel
    })
    try {
      //Encript password
      users.pwd = await users.encryptPassword(users.pwd);
      await users.save();
      const token = jwt.sign({ id: users._id }, config.secret, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
      });
      //res.status(201).json(newUser)  --const newUser = await users.save();
      res.status(201).json({ message: 'Added User', auth: true, token});
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
});

// Updating One
r.patch('/sigin/:id', getUser, async (req, res) => {
  console.log('Path request ....... Update one user');
  if (req.body.usr.name != null) {
    res.users.usr.name = req.body.usr.name;
  }
  if (req.body.usr.lastname != null) {
    res.users.usr.lastname = req.body.usr.lastname;
  }
  if (req.body.email != null) {
    res.users.email = req.body.email;
  }
  if (req.body.pwd != null) {
    hashpwd = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };
    res.users.pwd = await hashpwd(req.body.pwd);
  }
  try {
    await res.users.save();
    res.status(202).json({ message: 'Updated User' });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// Deleting One
r.delete('/sigin/:id', getUser, async (req, res) => {
  console.log('Delete request ....... Deleted one user');
  try {
    await res.users.remove();
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


async function getUser(req, res, next) {
  let user
  try {
    user = await Usr.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.users = user
  next()
}

module.exports = r