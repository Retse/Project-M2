const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middlewares = require('../middlewares/middlewares');

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
  const { title, image, date, city, region, country, startingPoint, description, difficultyLevel, duration, distance } = req.body;
  const newEvent = new Event({ title, image, date, location: { city, region, country }, startingPoint, description, difficultyLevel, duration, distance });
  newEvent.save()
    .then(() => {
      res.redirect('/events/');
    })
    .catch(next);
});

// hay que meter el dato en la sesión para luego renderizar la vista en función del dato
router.post('/list', middlewares.requireUser, (req, res, next) => {
  const city = req.body.city;
  req.session.
  // Event.find({ location: { city: city } })
    // .then( events => {
      res.redirect('/events/list');
    // })
    // .catch(next);
})
router.get('/list', middlewares.requireUser, (req, res, next) => { 
  Event.find()
    .then( events => {
      res.render('events/list', { events });
    })
    .catch(next);
});

router.get('/:_id', middlewares.requireUser, (req, res, next) => {
  const id = req.params._id;
  Event.findById(id)
    .then((event) => {
      res.render('events/event-detail', { event });
    })
    .catch(next);
});

module.exports = router;
