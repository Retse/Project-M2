const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');

const saltRounds = 10;
const router = express.Router();

// Ruta post signup
router.post('/signup', middlewares.requireAnon, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const dateOfBirth = req.body.birthdate;

  if (!username || !password || !email || !dateOfBirth) {
    req.flash('error', 'All fields must be completed');
    return res.redirect('/');
  }

  User.findOne({ username } || { email })
    .then((user) => {
      if (user) {
        req.flash('error', 'Username already taken');
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
    req.flash('error', 'Username and password can\'t be empty');
    return res.redirect('/');
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Username or password are incorrect');
        return res.redirect('/');
      }

      if (bcrypt.compareSync(password, user.password)) {
        // Añadir el usuario a la sesion si ok
        req.session.currentUser = user;
        res.redirect('/events');
      } else {
        req.flash('error', 'Username or password are incorrect');
        res.redirect('/');
      }
    })
    .catch(next);
});

router.post('/logout', middlewares.requireUser, (req, res, next) => {
  req.session.destroy((err) => next(err));
  res.redirect('/');
});

module.exports = router;
