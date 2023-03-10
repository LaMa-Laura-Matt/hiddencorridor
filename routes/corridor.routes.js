const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//Fifth Floor
router.get("/fifth-floor", isLoggedIn, (req, res, next) => {
  res.render("corridor/fifth-floor");
});

// Hidden Corridor
router.get("/hidden-corridor", isLoggedIn, (req, res, next) => {
  res.render("corridor/hidden-corridor");
});

//Trophy Room
router.get("/trophy-room", isLoggedIn, (req, res, next) => {
  let gryffindorHousePoints = 0;
  let ravenclawHousePoints = 0;
  let hufflepuffHousePoints = 0;
  let slytherinHousePoints = 0;

  Potion.find()
    .populate("wizard")
    .then((allPotionsFromDB) => {
      allPotionsFromDB.forEach((onePotion) => {

        if (onePotion.wizard.house === "gryffindor") {
          gryffindorHousePoints += onePotion.numberOfLikes.length * 5;
        } else if (onePotion.wizard.house === "ravenclaw") {
          ravenclawHousePoints += onePotion.numberOfLikes.length * 5;
        } else if (onePotion.wizard.house === "hufflepuff") {
          hufflepuffHousePoints += onePotion.numberOfLikes.length * 5;
        } else {
          slytherinHousePoints += onePotion.numberOfLikes.length * 5;
        }
      });
      const allHousePoints = {
        gryffindorHousePoints: gryffindorHousePoints,
        ravenclawHousePoints: ravenclawHousePoints,
        hufflepuffHousePoints: hufflepuffHousePoints,
        slytherinHousePoints: slytherinHousePoints,
      };
      res.render("corridor/trophy-room", { allHousePoints: allHousePoints });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
