const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');

const router = express.Router();

// Ruta post login
router.post('/index', middlewares.requireAnon, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.flash('error', 'Username and password can\'t be empty');
    return res.redirect('/');
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Username or password are incorrect');
        return res.redirect('/');
      }

      if (bcrypt.compareSync(password, user.password)) {
        // Añadir el usuario a la sesion si ok
        req.session.currentUser = user;
        res.redirect('/events/index');
      } else {
        req.flash('error', 'Username or password are incorrect');
        res.redirect('/');
      }
    })
    .catch(next);
});

module.exports = router;
