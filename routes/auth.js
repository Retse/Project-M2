const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');
const flashMessages = require('../middlewares/notifications');

const saltRounds = 10;
const router = express.Router();

// Ruta post signup
router.post('/signup', middlewares.requireAnon, (req, res, next) => {
  const { username, password, email, dateOfBirth } = req.body;

  if (!username || !password || !email || !dateOfBirth) {
    console.log(username, password, email, dateOfBirth);
    req.flash('error', flashMessages.allFieldsCompleteError);
    return res.redirect('/');
  }

  User.findOne({ username } || { email })
    .then((user) => {
      if (user) {
        req.flash('error', flashMessages.userNameTaken);
        return res.redirect('/');
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = new User({ username, email, password: hashedPassword, dateOfBirth });

      newUser.save()
        .then(() => {
          // guardamos el usuario en la session
          req.session.currentUser = newUser;
          // redirect siempre com barra
          res.redirect('/events');
        })
        .catch(next);
    })
    .catch(next);
});

// Ruta post login
router.post('/login', middlewares.userLoggedIn, (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', flashMessages.loginEmptyField);
    return res.redirect('/');
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', flashMessages.loginIncorrectField);
        return res.redirect('/');
      }

      if (bcrypt.compareSync(password, user.password)) {
        // Añadir el usuario a la sesion si ok
        req.session.currentUser = user;
        return res.redirect('/events');
      } else {
        req.flash('error', flashMessages.loginIncorrectField);
        res.redirect('/');
      }
    })
    .catch(next);
});

router.post('/logout', middlewares.requireUser, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      return res.redirect('/');
    }
  });
});

module.exports = router;
