const User = require('../models/User')
const Exercise = require('../models/Exercise')

module.exports = {
  createUser: (user) => {
    return new Promise( (resolve, reject) => {
      User.create(user)
      .then( data => {
        
        resolve({ _id: data._id, username: user.username})
      })
      .catch( err => {
        reject(err)
      })
    })
  },
  
  createExercise: (userId, exercise) => {
    return new Promise( (resolve, reject) => {
      User.findById(userId)
      .then( data => {
        var user = data

        
        var new_exercise = new Exercise({ 
          description: exercise.description, 
          duration: exercise.duration,
          date: exercise.date,
          user_id: user._id
        })
  
        
        user.log.push(new_exercise)
        
        user.save( (err, data) => {
          if (err) reject(err)
        })
 
        new_exercise.save( (err, data) => {
          if (err) reject(err)
          var utc = new Date(data.date).toDateString()
          resolve({
            username: user.username,
            description: data.description,
            duration: data.duration,
            _id: user._id,
            date: utc
          })
        })
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  
  getUsers: (params) => {
    
    return new Promise( (resolve, reject) => {
      User.find()
      .select('username _id __v')
      .exec()
      .then( data => {
        resolve(data)
      })
      .catch( err => {
        reject(err)
      })
    })
  },
  
  getLogs: (params) => {

    var queryLog = { 
      path: 'log',
      select: 'description duration date -_id',
      match: { date: { }},
      options: { limit: params.limit }
    }

    if(params.from){
      var from = new Date(params.from)
      queryLog.match.date["$gte"] = from;
    }
    if(params.to){
      var to = new Date(params.to)
      queryLog.match.date["$lte"] = to;
    }
    
    if(!Object.keys(queryLog.match.date).length){
      delete queryLog['match']
    }

    
    var queryUser = { _id : params.userId }
   
    return new Promise( (resolve, reject) => {
      User.findOne(queryUser)
      .select('username _id __v')
      .populate(queryLog)
      .exec()
      .then( data => {
        let newLogs = []
        data.log.map(obj => { 
          var utc = new Date(obj.date).toDateString()
          
          newLogs.push({
            description: obj.description,
            duration: obj.duration,
            date: utc
          })
        })
        
        
        var user = {
          _id: data._id,
          username: data.username,
          count: data.log.length
          
        }
        
        if(params.from){
          user.from = from.toDateString()
        }
        
        if(params.to){
          user.to = to.toDateString()
        }
        
        user.log = newLogs
        
        resolve(user)
      })
      .catch( err => {
        reject(err)
      })
    })
  }

}