const express = require("express");
const router = express.Router();
// const Potion = require("../models/Potion.model");
// const Wizard = require("../models/Wizard.model");

const isLoggedIn = require("../middleware/isLoggedIn");

//Fifth Floor
router.get("/fifth-floor", isLoggedIn, (req, res, next) => {
 
  res.render("corridor/fifth-floor");
});

// Hidden Corridor
router.get("/hidden-corridor", isLoggedIn,(req, res, next) => {
   res.render("corridor/hidden-corridor");
    });

//Trophy Room
router.get("/trophy-room", isLoggedIn,(req, res, next) => {
  res.render("corridor/trophy-room");
   })
    

module.exports = router;
