
function userLoggedIn (req, res, next) {
  const user = req.session.currentUser;
  if (!user) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  userLoggedIn
};
