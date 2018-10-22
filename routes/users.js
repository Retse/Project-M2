const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const middlewares = require('../middlewares/middlewares');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/* GET users listing. */
router.get('/', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .then(user => {
      Event.find({
        participants: ObjectId(userId)
      })
        .then(event => {
          res.render('profile', { 'user': user, 'event': event });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
