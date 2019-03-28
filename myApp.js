var express = require('express');
var app = express();
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const shortid = require('shortid')

const userCtrl = require('./controllers/UserController')

app.post('/new-user', (req, res) => {
  var user = {_id: shortid.generate(), username: req.body.username}
  console.log(user)
  
  userCtrl.createUser(user)
  .then( data => {
    res.json(data)
  })
  .catch(err => {
    res.json({err: err.message})
  })
  //res.send("creating user")
})

app.post('/add', (req, res) => {
  var userid = req.body.userId
  console.log("user--->", userid)
  
  console.log(req.body)
  
  userCtrl.createExercise(userid, req.body)
  .then( data => {
    res.json(data)
  })
  .catch( err => {
    res.json({err: err.message})
  })
  
})


app.get('/log', (req, res) => {
  
  userCtrl.getLogs(req.query)
  .then( data => {
    data.count = data.log.length
    res.json(data)
  })
  .catch( err => {
    res.json({err: err.message})
  })
})

app.get('/users', (req, res) => {
  userCtrl.getUsers()
  .then( data => {
    res.json(data)
  })
  .catch( err => {
    res.json({err: err.message})
  })
})


module.exports = app;