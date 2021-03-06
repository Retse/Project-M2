const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middlewares = require('../middlewares/middlewares');
const flashMessages = require('../middlewares/notifications');

router.get('/', middlewares.requireUser, (req, res, next) => {
  Event.find().sort({ date: 1 })
    .populate('guide')
    .then(events => {
      res.render('events/index', { events });
    })
    .catch(error => {
      next(error);
    });
});

/* --------- GET Create Event --------- */
router.get('/create', middlewares.requireUser, (req, res, next) => {
  res.render('events/create');
});

/* ---------  POST Create Event --------- */
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

  const requiredFields = [ title, date, city, description ];

  if (requiredFields.includes('')) {
    req.flash('danger', flashMessages.allFieldsCompleteError);
    return res.redirect('/events/');
  }

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

/* --------- GET Find Event Filter --------- */

router.get('/list', middlewares.requireUser, (req, res, next) => {
  const region = req.query.region;

  Event.find({ 'location.region': region })
    .then(events => {
      res.render('events/list', { events });
    })
    .catch(next);
});

/* --------- GET Event Detail --------- */

router.get('/:_id', (req, res, next) => {
  const currentUser = req.session.currentUser;
  const id = req.params._id;
  let userId;
  if (currentUser) {
    userId = currentUser._id;
  }
  //  if (ObjectId.isValid(id)) {
  console.log('La ruta es igual');
  Event.findById(id)
    .populate('participants')
    .populate('guide')
    .then((event) => {
      res.render('events/event-detail', { 'event': event, 'userId': userId });
    })
    .catch(next);
  // }
  // next();
});

/* --------- GET Edit Event --------- */
router.get('/:_id/edit', middlewares.requireUser, (req, res, next) => {
  const eventId = req.params._id;
  const userId = req.session.currentUser._id;

  Event.findById(eventId)
    .then(event => {
      const isGuide = event.guide.some(guide => {
        return guide.equals(userId);
      });
      if (isGuide) {
        res.render('events/edit', { event: event });
      } else {
        req.flash('danger', flashMessages.cantEdit);
        res.redirect(`/events/${eventId}`);
      }
    })
    .catch(next);
});

/* --------- POST Edit Event --------- */
router.post('/:_id', middlewares.requireUser, (req, res, next) => {
  const event = req.body;
  const id = req.params._id;
  const { title, date, description } = req.body;
  const requiredFields = [ title, date, description ];

  if (requiredFields.includes('')) {
    req.flash('info', flashMessages.allFieldsCompleteError);
    return res.redirect(`/events/${id}`);
  }

  Event.findByIdAndUpdate(id, event)
    .then(event => {
      req.flash('info', flashMessages.eventEdited);
      res.redirect(`/events/${id}`);
    })
    .catch(next);
});

/* --------- POST Join Event  --------- */
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
            req.flash('success', flashMessages.joinEvent);
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

/* --------- POST Event Leave --------- */
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

/* --------- POST Event Delete --------- */
router.post('/:_id/delete-event', middlewares.requireUser, (req, res, next) => {
  const eventId = req.params._id;
  const userId = req.session.currentUser._id;

  Event.findById(eventId)
    .then(event => {
      const isGuide = event.guide.some(guide => {
        return guide.equals(userId);
      });

      if (isGuide) {
        Event.findByIdAndDelete(eventId)
          .then(() => {
            res.redirect('/events');
          })
          .catch(next);
      } else {
        req.flash('info', flashMessages.cantEdit);
        res.redirect(`/events/${eventId}`);
      }
    })
    .catch(next);
});

module.exports = router;
