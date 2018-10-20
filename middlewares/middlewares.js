function requireUser (req, res, next) {
  const user = req.session.currentUser;

  if (!user) {
    return res.redirect('/auth/login');
  } else {
    next();
  }
}

function requireAnon (req, res, next) {
  const user = req.session.currentUser;

  if (user) {
    return res.redirect('/auth/profile');
  } else {
    next();
  }
}

module.exports = {
  requireUser,
  requireAnon
};
