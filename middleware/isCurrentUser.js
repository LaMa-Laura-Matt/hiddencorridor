module.exports = (req, res, next) => {

  if (req.session.currentWizard._id === req.params.profileId) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};
