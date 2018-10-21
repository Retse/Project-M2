const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const middlewares = require('../middlewares/middlewares');

/* GET home page. */
router.get('/', middlewares.userLoggedIn, (req, res, next) => {
  Event.find().limit(3)
    .then(events => {
      res.render('index', { events });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
