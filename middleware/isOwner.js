const Potion = require("../models/Potion.model");

module.exports = (req, res, next) => {
  Potion.findById(req.params.potionId)
    .populate("wizard")
    .then((potion) => {
      if (req.session.currentWizard.Wizardname !== potion.wizard.Wizardname) {
        return res.redirect("/potions");
      }
      next();
    })
    .catch((err) => {
      console.log("error getting potions from DB", err);
    });
};
