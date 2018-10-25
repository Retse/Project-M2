const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const middlewares = require('../middlewares/middlewares');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const flashMessages = require('../middlewares/notifications');
const upload = require('../services/cloudinary.js');

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

/* Edit Profile */

router.get('/profileEdit', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .then(user => {
      res.render('profileEdit', { 'user': user });
    })
    .catch(next);
});

router.post('/profileEdit', middlewares.requireUser, upload.single('image'), (req, res, next) => {
  const userId = req.session.currentUser._id;
  const { tagline, aboutme } = req.body;
  let image;

  if (req.file) {
    image = req.file.url;
  } else {
    image = req.session.currentUser.image;
  }

  User.findByIdAndUpdate(userId, { tagline: `${tagline}`, aboutme: `${aboutme}`, image: `${image}` })
    .then(user => {
      req.flash('info', flashMessages.profileEdit);
      res.redirect('/users');
    })
    .catch(next);
});

module.exports = router;
