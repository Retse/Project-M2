'use strict';
// authentication

function requireUser (req, res, next) {
  const user = req.session.currentUser;

  if (!user) { return res.redirect('/'); }
  next();
}

function requireAnon (req, res, next) {
  const user = req.session.currentUser;

  if (user) { return res.redirect('/'); }
  next();
}

function userLoggedIn (req, res, next) {
  const user = req.session.currentUser;
  if (user) { return res.redirect('/events'); }
  next();
}

// Sessions

function setUserToLocal (req, res, next) {
  res.locals.currentUser = req.session.currentUser;
  next();
}

// Flash Messages

function flashMessages (req, res, next) {
  // We extract the messages separately cause we call req.flash() we'll clean the object flash.
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  res.locals.dangerMessages = req.flash('danger');
  res.locals.successMessages = req.flash('success');
  res.locals.warningMessages = req.flash('warning');
  next();
}

module.exports = {

  requireUser,
  requireAnon,
  userLoggedIn,
  setUserToLocal,
  flashMessages

};
