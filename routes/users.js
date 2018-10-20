const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');

/* GET users listing. */
router.get('/', middlewares.requireUser, (req, res, next) => {
  User.find()
    .then(user => {
      res.render('profile', { user });
    });
});

module.exports = router;
