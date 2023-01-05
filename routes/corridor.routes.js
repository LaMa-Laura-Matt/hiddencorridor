const express = require("express");
const router = express.Router();
// const Potion = require("../models/Potion.model");
// const Wizard = require("../models/Wizard.model");

//Entrance Hall
router.get("/entrance-hall", (req, res, next) => {
 
  res.render("corridor/entrance-hall");
});

module.exports = router;
