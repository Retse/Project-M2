const express = require('express');
const router = express.Router();
const Event = require('../models/event');

/* GET home page. */
router.get('/', (req, res, next) => {
  Event.find().limit(2)
    .then(events => {
      res.render('index', { events });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
