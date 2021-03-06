const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const eventSchema = new Schema({
  title: String,
  image: String,
  guide: [{
    type: ObjectId,
    ref: 'User'
  }],
  date: Date,
  location: {
    city: String,
    region: String,
    country: String
  },
  startingPoint: String,
  description: String,
  participants: [{
    type: ObjectId,
    ref: 'User'
  }],
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  duration: Number,
  distance: Number
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
