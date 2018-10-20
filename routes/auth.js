const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const middlewares = require('../middlewares/middlewares');

const saltRounds = 10;
const router = express.Router();

// Ruta post signup
router.post('/index', middlewares.requireAnon, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (!username || !password || !email) {
    req.flash('error', 'Username, email or password cannot be empty');
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

      const newUser = new User({ username, email, password: hashedPassword });

      newUser.save()
        .then(() => {
          // guardamos el usuario en la session
          req.session.currentUser = newUser;
          // redirect siempre com barra
          res.redirect('/events/index');
        })
        .catch(next);
    })
    .catch(next);
});

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

router.post('/logout', middlewares.requireUser, (req, res, next) => {
  req.session.destroy((err) => next(err));
  res.redirect('/');
});

module.exports = router;
