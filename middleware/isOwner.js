const Potion = require("../models/Potion.model");

module.exports = (req, res, next) => {
    // if an already logged in Wizard tries to access the login page it
    // redirects the Wizard to the home page
Potion.findById(req.params.potionId)
.populate("wizard")
.then ((potion) => {
  console.log(potion)
  if (req.session.currentWizard.Wizardname !== potion.wizard.Wizardname) {
    return res.redirect("/hidden-corridor");
  }
  next();
})
.catch((err) => {
  console.log("error getting potions from DB", err);
  })
}


 