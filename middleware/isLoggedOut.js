module.exports = (req, res, next) => {
  // if an already logged in Wizard tries to access the login page it
  // redirects the Wizard to the home page
  if (req.session.currentWizard) {
    return res.redirect("/");
  }
  next();
};
