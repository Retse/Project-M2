const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middlewares = require('../middlewares/middlewares');

// ruta a events/index - renderiza listado eventos
// router.get('/', middlewares.userLoggedIn, (req, res, next) => {
router.get('/', middlewares.requireUser, (req, res, next) => {
  Event.find()
    .then(events => {
      res.render('events/index', { events });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/create', middlewares.requireUser, (req, res, next) => {
  res.render('events/create');
});
router.post('/create', middlewares.requireUser, (req, res, next) => {
  const { title, image, date, city, region, country, startingPoint, description, difficultyLevel, duration, distance } = req.body;
  const newEvent = new Event({ title, image, date, location: { city, region, country }, startingPoint, description, difficultyLevel, duration, distance });
  newEvent.save()
    .then(() => {
      res.redirect('/events/');
    })
    .catch(next);
});

router.get('/:_id', middlewares.requireUser, (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .populate('participants')
    .then((event) => {
      res.render('events/event-detail', { event });
    })
    .catch(next);
});

router.post('/:_id/join', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id; // verificar

  Event.findById(eventId)
    .then(event => {
      console.log(userId);
      if (event.participants.includes(`${userId}`)) {
        event.participants.push(ObjectId(userId));
        event.save()
          .then(item => {
            req.flash('info', 'Congrats, you have joined the event!');
            res.redirect(`/events/${eventId}`);
          })
          .catch(next);
      } else {
        req.flash('info', 'You cant join the event more than once!');
        res.redirect(`/events/${eventId}`);
      }
    })
    .catch(next);
});

module.exports = router;
