const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middlewares = require('../middlewares/middlewares');

// ruta a events/index - renderiza listado eventos
router.get('/', (req, res, next) => {
  Event.find()
    .then(events => {
      res.render('events/index', { events });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
