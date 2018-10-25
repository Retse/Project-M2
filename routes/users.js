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
  const image = req.file.url;

  User.findByIdAndUpdate(userId, { tagline: `${tagline}`, aboutme: `${aboutme}`, image: `${image}` })
    .then(user => {
      req.flash('info', flashMessages.profileEdit);
      res.redirect('/users');
    })
    .catch(next);
});

/* --------- GET See other user Profile --------- */
// router.get('/:_id', (req, res, next) => {
//   const id = req.params._id;
//   // const { _id: id } = req.params
//   //  if (ObjectId.isValid(id)) {
//   Event.findById(id)
//     .populate('participants')
//     .populate('guide')
//     .then((event) => {
//       res.render('events/event-detail', { event });
//     })
//     .catch(next);
//   // }
//   // next();
// });

module.exports = router;
