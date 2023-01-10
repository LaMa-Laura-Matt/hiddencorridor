const express = require("express");
const router = express.Router();
// const Potion = require("../models/Potion.model");
// const Wizard = require("../models/Wizard.model");

const isLoggedIn = require("../middleware/isLoggedIn");

//Fifth Floor
router.get("/fifth-floor", isLoggedIn, (req, res, next) => {
 
  res.render("corridor/fifth-floor");
});

module.exports = router;
