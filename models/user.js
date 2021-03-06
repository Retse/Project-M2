const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  dateOfBirth: Date,
  aboutme: String,
  tagline: String,
  image: String,
  followers: [{
    type: ObjectId,
    ref: 'User'
  }],
  routes: [{
    type: ObjectId,
    ref: 'Event'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
