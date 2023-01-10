const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const Wizard = require("../models/Wizard.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const isPotionOwner = require("../middleware/isOwner");


// PotionsRoom
router.get("/potions", isLoggedIn,(req, res, next) => {
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
    wizard:req.session.currentWizard,
    numberOfLikes: 0
  };

  Potion.create(newPotion)
    .then(() => {
      res.redirect("/potions");
    })
    .catch((err) => {
      console.log("error creating the potion", err);
      next();
    });
});



//READ: Potion details
router.get("/potions/:potionid", isLoggedIn,(req, res, next) => {
  const id = req.params.potionid;
  let isOwner = false



  Potion.findById(id)
      .populate("wizard")
      .then(potionDetails => {
      

          if (req.session.currentWizard.Wizardname === potionDetails.wizard.Wizardname) {
           isOwner = true
          }


          res.render("potions/potion", {potionDetails: potionDetails, isOwner:isOwner} );
      })
      .catch(err => {
          console.log("error getting potion details from DB", err);
          next();
      })
});


//display the update potion form
router.get("/potions/:potionId/edit", isLoggedIn, isPotionOwner, (req, res, next) => {

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
router.post("/potions/:potionId/edit", isLoggedIn, isPotionOwner, (req, res, next) => {
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
          res.redirect('/potions/' + potionId);
          // This didnt work !! (`potions/${potionId}`);
      })
      .catch(err => {
          console.log("Error updating potion...", err);
          next();
      });
});

//DELETE
router.post("/potions/:potionId/delete", isLoggedIn, isPotionOwner, (req, res, next) => {
  Potion.findByIdAndDelete(req.params.potionId)
      .then(() => {
          res.redirect("/potions");
      })
      .catch(err => {
          console.log("Error deleting potion...", err);
          next();
      });
});
