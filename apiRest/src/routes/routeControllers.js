const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
//const mongoose = require ('mongoose')
const r = express.Router();
const Usr = require('../models/user/users');

const jsonParser = bodyParser.json();
// Getting all
r.get('/', async (req, res) => {
  try {
    console.log('Get request ....... Find all');
    const usrs = await Usr.find();
    res.json(usrs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
r.get('/:id', getUser, (req, res) => {
  console.log('Get request ....... Find one');
  res.json(res.users)
})

// Creating one
r.post('/',jsonParser,async (req, res) => {
  console.log('Post request ....... Add user');
  const users = new Usr(
    {
      usr : {name : req.body.usr.name , lastname : req.body.usr.lastname},
      email : req.body.email,
      pwd : req.body.pwd,   
      permissionLevel: req.body.permissionLevel
    })
    try {
      bcrypt.hash(users.pwd, 10, (err, hashpwd) => {
        console.log('Pwd without hash. ',users.pwd);
        users.pwd = hashpwd;
        console.log('Pwd with hash: ',users.pwd);
      });
      await users.save();
      //res.status(201).json(newUser)  --const newUser = await users.save();
      res.status(201).json({ message: 'Added User' });
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})

// Updating One
r.patch('/:id', getUser, async (req, res) => {
  console.log('Path request ....... update user');
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
    bcrypt.hash(req.body.pwd, 10, (err, hashpwd) => {
      console.log('Pwd without hash. ',req.body.pwd);
      req.body.pwd = hashpwd;
      console.log('Pwd with hash: ',req.body.pwd);
    });
    res.users.pwd = req.body.pwd;
  }
  try {
    await res.users.save();
    res.status(202).json({ message: 'Updated User' });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
r.delete('/:id', getUser, async (req, res) => {
  console.log('Delete request .......');
  try {
    await res.users.remove();
    res.json({ message: 'Deleted User' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

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