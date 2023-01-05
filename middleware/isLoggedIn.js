module.exports = (req, res, next) => {
  // checks if the Wizard is logged in when trying to access a specific page
  if (!req.session.currentWizard) {
    return res.redirect("/auth/login");
  }

  next();
};
