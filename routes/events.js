const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middlewares = require('../middlewares/middlewares');
const flashMessages = require('../middlewares/notifications');

router.get('/', middlewares.requireUser, (req, res, next) => {

  Event.find().sort({ date: 1 })
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
  const {
    title,
    image,
    date,
    city,
    region,
    country,
    startingPoint,
    description,
    difficultyLevel,
    duration,
    distance
  } = req.body;

  const newEvent = new Event({
    title,
    image,
    date,
    location: { city, region, country },
    startingPoint,
    description,
    difficultyLevel,
    duration,
    distance
  });

  const guideId = req.session.currentUser._id;
  newEvent.guide.push(ObjectId(guideId));
  newEvent.save()
    .then(() => {
      res.redirect('/events/');
    })
    .catch(next);
});

router.post('/list', middlewares.requireUser, (req, res, next) => {
  req.session.city = req.body.city;
  res.redirect('/events/list');
});
router.get('/list', middlewares.requireUser, (req, res, next) => {
  const city = req.session.city;
  Event.find({ 'location.city': city })
    .then(events => {
      res.render('events/list', { events });
    })
    .catch(next);
});

router.get('/:_id/edit', middlewares.requireUser, (req, res, next) => {
  const eventId = req.params._id;
  Event.findById(eventId)
    .then(event => {
      res.render('events/edit', { event: event })
    })
    .catch(next)
});

router.post('/:_id', middlewares.requireUser, (req, res, next) => {
  const event = req.body;
  const id = req.params._id;
  Event.findByIdAndUpdate(id, event)
    .then(event => {
      req.flash('info', flashMessages.eventEdited);
      res.redirect(`/events/${id}`);
    })
    .catch(next);
});

router.get('/:_id', (req, res, next) => {
  const id = req.params._id;
  // const { _id: id } = req.params
  if (ObjectId.isValid(id)) {
    Event.findById(id)
      .populate('participants')
      .populate('guide')
      .then((event) => {
        res.render('events/event-detail', { event });
      })
      .catch(next);
  } else {
    next();
  }
});

router.post('/:_id/join', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id;

  Event.findById(eventId)
    .then(event => {
      const isInArray = event.participants.some(participant => {
        return participant.equals(userId);
      });
      if (!isInArray) {
        event.participants.push(ObjectId(userId));
        event.save()
          .then(item => {
            req.flash('info', flashMessages.joinEvent);
            res.redirect(`/events/${eventId}`);
          })
          .catch(next);
      } else {
        req.flash('info', flashMessages.cantJoinEvent);
        res.redirect(`/events/${eventId}`);
      }
    })
    .catch(next);
});

router.get('/:_id', (req, res, next) => {
  const id = req.params._id;

  // const { _id: id } = req.params
  // if (ObjectId.isValid(id)) {
  Event.findById(id)
    .populate('participants')
    .populate('guide')
    .then((event) => {
      res.render('events/event-detail', { event });
    })
    .catch(next);
  // }
  // next();
});

router.post('/:_id/leave', middlewares.requireUser, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const eventId = req.params._id;

  Event.findById(eventId)
    .then(event => {
      event.participants.pull({ _id: ObjectId(userId) });
      event.save()
        .then(item => {
          res.redirect(`/events/${eventId}`);
        });
    })
    .catch(next);
});

module.exports = router;
