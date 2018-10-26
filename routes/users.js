const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const middlewares = require('../middlewares/middlewares');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const flashMessages = require('../middlewares/notifications');
const upload = require('../services/cloudinary.js');

/* GET users profile. */
router.get('/', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .populate('followers')
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
    image = req.file.secure_url;
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

/* --------- GET See other user Profile --------- */
router.get('/:_id', middlewares.requireUser, (req, res, next) => {
  const id = req.params._id;
  const currentUserId = req.session.currentUser._id;

  if (currentUserId === id) {
    return res.redirect('/users');
  }

  User.findById(id)
    .populate('followers')
    .then((user) => {
      Event.find({
        participants: ObjectId(id)
      })
        .then(event => {
          res.render('users/otherUserProfile', { 'user': user, 'event': event });
        })
        .catch(next);
    });
});

/* --------- POST Follow Other Users --------- */

router.post('/:_id/follow', (req, res, next) => {
  const userToFollowId = req.params._id;
  const currentUserId = req.session.currentUser._id;

  User.findById(userToFollowId)
    .then((user) => {
      const isFollowing = user.followers.some(follower => {
        return follower.equals(currentUserId);
      });

      if (isFollowing) {
        req.flash('danger', flashMessages.alreadyFollowing);
        return res.redirect(`/users/${userToFollowId}`);
      }

      user.followers.push(ObjectId(currentUserId));
      user.save()
        .then(
          res.redirect(`/users/${userToFollowId}`)
        )
        .catch(next);
    });
});

module.exports = router;
