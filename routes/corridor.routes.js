const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const Wizard = require("../models/Wizard.model");

//Entrance Hall
router.get("/entrance-hall", (req, res, next) => {
  console.log("welcome to the GH");
  res.render("corridor/entrance-hall");
});

// Hidden Corridor
router.get("/hidden-corridor", (req, res, next) => {
  //here we will list the potions so will need to do a .find())
  Potion.find()
    .then((potionsFromDB) => {
      console.log("welcome to the HC");
      res.render("corridor/hidden-corridor", { potions: potionsFromDB });
    })
    .catch((err) => {
      console.log("error getting potions from DB", err);
      next(err);
    });
});

// Create a Potion Form
router.get("/create-potion", (req, res, next) => {
  console.log("ohh think you can brew do you?");
  res.render("corridor/potion-create");
});

// POST Create a Potion
router.post("/create-potion", (req, res, next) => {
  console.log("well... not too bad");
  const newPotion = {
    potionName: req.body.potionName,
    ingredients: req.body.ingredients,
    method: req.body.method,
    potionTime: req.body.potionTime,
    difficulty: req.body.difficulty,
    sideEffects: req.body.sideEffects
  };

  Potion.create(newPotion)
    .then(() => {
      res.redirect("/hidden-corridor");
    })
    .catch((err) => {
      console.log("error creating the potion", err);
      next();
    });
});

module.exports = router;
