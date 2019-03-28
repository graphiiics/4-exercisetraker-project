const mongoose = require('mongoose')
var Schema = mongoose.Schema
const shortid = require('shortid')


var UserSchema = new Schema({
  _id: { type: String, required: true},
  username: { type: String, trim: true, required: true},
  log: { type: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]}
})

var User = mongoose.model('User', UserSchema)

module.exports = User

