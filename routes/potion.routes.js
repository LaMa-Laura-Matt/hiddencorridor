const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const Wizard = require("../models/Wizard.model");
const isLoggedIn = require("../middleware/isLoggedIn");


// Hidden Corridor
router.get("/hidden-corridor", isLoggedIn,(req, res, next) => {
  //here we will list the potions so will need to do a .find())
  
  Potion.find()
  .populate("wizard")
    .then((potionsFromDB) => {
      console.log("welcome to the HC");
      res.render("potions/potion-list", { potions: potionsFromDB });
    })
    .catch((err) => {
      console.log("error getting potions from DB", err);
      next(err);
    });
});

// Create a Potion Form
router.get("/create-potion", isLoggedIn, (req, res, next) => {
  console.log("ohh think you can brew do you?");
  res.render("potions/potion-create");
});

// POST Create a Potion
router.post("/create-potion", isLoggedIn, (req, res, next) => {
  console.log("well... not too bad");
  console.log(req.session.currentWizard);
  const newPotion = {
    potionName: req.body.potionName,
    method: req.body.method,
    ingredients: req.body.ingredients,
    potionTime: req.body.potionTime,
    difficulty: req.body.difficulty,
    sideEffects: req.body.sideEffects,
    wizard:req.session.currentWizard
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



//READ: Potion details
router.get("/hidden-corridor/:potionid", isLoggedIn,(req, res, next) => {
  const id = req.params.potionid;

  Potion.findById(id)
      .populate("wizard")
      .then(potionDetails => {
          res.render("potions/potion", potionDetails);
      })
      .catch(err => {
          console.log("error getting potion details from DB", err);
          next();
      })
});


//display the update potion form
router.get("/hidden-corridor/:potionId/edit", isLoggedIn, (req, res, next) => {

  const id = req.params.potionId;

  Potion.findById(id)
 
      .then((potionDetails) => {
          console.log(potionDetails);

          res.render("potions/potion-edit", potionDetails);
      })
      .catch(err => {
          console.log("Error getting potion details from DB...", err);
          next();
      });
});
module.exports = router;

//UPDATE: process form
router.post("/hidden-corridor/:potionId/edit", isLoggedIn, (req, res, next) => {
  const potionId = req.params.potionId;

  const newDetails = {
      potionName: req.body.potionName,
      ingredients: req.body.ingredients,
      method: req.body.method,
      potionTime: req.body.potionTime,
      difficulty: req.body.difficulty,
      sideEffects: req.body.sideEffects
  }

  Potion.findByIdAndUpdate(potionId, newDetails)
      .then(() => {
          res.redirect('/hidden-corridor/' + potionId);
          // This didnt work !! (`hidden-corridor/${potionId}`);
      })
      .catch(err => {
          console.log("Error updating potion...", err);
          next();
      });
});

//DELETE
router.post("/hidden-corridor/:potionId/delete", isLoggedIn, (req, res, next) => {
  Potion.findByIdAndDelete(req.params.potionId)
      .then(() => {
          res.redirect("/hidden-corridor");
      })
      .catch(err => {
          console.log("Error deleting potion...", err);
          next();
      });
});
