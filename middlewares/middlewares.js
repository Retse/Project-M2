function requireUser (req, res, next) {
  const user = req.session.currentUser;

  if (!user) {
    return res.redirect('/');
  } else {
    next();
  }
}

function requireAnon (req, res, next) {
  const user = req.session.currentUser;

  if (user) {
    return res.redirect('/');
  } else {
    next();
  }
}

function userLoggedIn (req, res, next) {
  const user = req.session.currentUser;
  if (user) {
    return res.redirect('/events');
  }
  next();
}

module.exports = {

  requireUser,
  requireAnon,
  userLoggedIn

};
