const mongoose = require('mongoose')
var Schema = mongoose.Schema

var ExerciseSchema = new Schema({
  description: { type: String, required: true, trim: true, default: ''},
  duration: { type: Number, required: true, default: 1},
  date: { type: Date, required: true, default: Date.now},
  user_id: { type: String, required: true, trim: true }
})

 var Exercise = mongoose.model('Exercise', ExerciseSchema)
 
 module.exports = Exercise


