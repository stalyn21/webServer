// ./src/index.js
//conection mogodb
const mongoose = require ('mongoose');
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routers = require('./routes/routeControllers');
const authToken = require ('./routes/verifyAuth');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
//Parsear el body usando body parser
app.use(bodyParser.urlencoded({ extended: false }))//body formulario
app.use(bodyParser.json()) // body en formato json
// enabling CORS for all requests
app.use(cors());
// impplement HTTPS
// adding morgan to log HTTP requests
app.use(morgan('combined'));

// interface
app.use(express.static('public'));

//verify token
app.use(authToken);
//Routines post, get, delete, add
app.use('/users', routers);

//start database
const uri = 'mongodb://localhost/users';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
  ).catch (err => console.log('Failed conection database in ',err)); 
  
  mongoose.connection.once('open', _ =>{
    console.log('Conection database succesful .......', uri);
  })
  
//start server
app.listen(7070, 'localhost', () => {
  console.log(`Server running at 7070`);
});

