const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const isPotionOwner = require("../middleware/isOwner");

// PotionsRoom
router.get("/potions", isLoggedIn, (req, res, next) => {
  //here we will list the potions so will need to do a .find())

  Potion.find()
    .populate("wizard")
    .then((potionsFromDB) => {
      let gryffindor = false;
      let hufflepuff = false;
      let ravenclaw = false;
      let slytherin = false;

      if (req.session.currentWizard.house === "gryffindor") {
        gryffindor = true;
      } else if (req.session.currentWizard.house === "hufflepuff") {
        hufflepuff = true;
      } else if (req.session.currentWizard.house === "ravenclaw") {
        ravenclaw = true;
      } else if (req.session.currentWizard.house === "slytherin") {
        slytherin = true;
      }

      res.render("potions/potion-list", {
        potions: potionsFromDB,
        gryffindor: gryffindor,
        hufflepuff: hufflepuff,
        ravenclaw: ravenclaw,
        slytherin: slytherin,
      });
    })
    .catch((err) => {
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
    wizard: req.session.currentWizard,
    numberOfLikes: req.session.currentWizard,
  };

  if (
    newPotion.potionName === "" ||
    newPotion.method === "" ||
    newPotion.ingredients.length <= 1
  ) {
    res.status(400).render("potions/potion-create", {
      errorMessage:
        "The fields Potion Name, Method and Ingredients are required. Please provide your Potion's Name, Method to brew and at least one ingredient.",
    });

    return;
  }

  Potion.create(newPotion)
    .then(() => {
      console.log(newPotion);
      res.redirect("/potions");
    })
    .catch((err) => {
      console.log("error creating the potion", err);
      next();
    });
});

//READ: Potion details
router.get("/potions/:potionid", isLoggedIn, (req, res, next) => {
  const id = req.params.potionid;
  let isOwner = false;

  Potion.findById(id)
    .populate("wizard")
    .then((potionDetails) => {
      let wizardHasNotLiked = potionDetails.numberOfLikes.includes(req.session.currentWizard._id);
      if (
        req.session.currentWizard.Wizardname === potionDetails.wizard.Wizardname
      ) {
        isOwner = true;
      }
      console.log(potionDetails.wizard.Wizardname);

      res.render("potions/potion", {
        potionDetails: potionDetails,
        isOwner: isOwner,
        wizardHasNotLiked: wizardHasNotLiked
      });
    })
    .catch((err) => {
      console.log("error getting potion details from DB", err);
      next();
    });
});

//display the update potion form
router.get(
  "/potions/:potionId/edit",
  isLoggedIn,
  isPotionOwner,
  (req, res, next) => {
    const id = req.params.potionId;

    Potion.findById(id)

      .then((potionDetails) => {
        console.log(potionDetails);

        res.render("potions/potion-edit", potionDetails);
      })
      .catch((err) => {
        console.log("Error getting potion details from DB...", err);
        next();
      });
  }
);
module.exports = router;

//UPDATE: process form
router.post(
  "/potions/:potionId/edit",
  isLoggedIn,
  isPotionOwner,
  (req, res, next) => {
    const potionId = req.params.potionId;

    const newDetails = {
      potionName: req.body.potionName,
      ingredients: req.body.ingredients,
      method: req.body.method,
      potionTime: req.body.potionTime,
      difficulty: req.body.difficulty,
      sideEffects: req.body.sideEffects,
    };

    if (
      newDetails.potionName === "" ||
      newDetails.method === "" ||
      newDetails.ingredients.length <= 1
    ) {
      res.status(400).render("potions/potion-edit", {
        errorMessage:
          "The fields Potion Name, Method and Ingredients are required. Please provide your Potion's Name, Method to brew and at least one ingredient.",
      });
      return;
    }

    Potion.findByIdAndUpdate(potionId, newDetails)
      .then(() => {
        res.redirect("/potions/" + potionId);
        // This didnt work !! (`potions/${potionId}`);
      })
      .catch((err) => {
        console.log("Error updating potion...", err);
        next();
      });
  }
);

//DELETE
router.post(
  "/potions/:potionId/delete",
  isLoggedIn,
  isPotionOwner,
  (req, res, next) => {
    Potion.findByIdAndDelete(req.params.potionId)
      .then(() => {
        res.redirect("/potions");
      })
      .catch((err) => {
        console.log("Error deleting potion...", err);
        next();
      });
  }
);

// Like functionality
router.post("/potions/:potionId/like", isLoggedIn, (req, res, next) => {
  const potionId = req.params.potionId;
  let newWizard = req.session.currentWizard._id;
  let wizardHasNotLiked = true;

  Potion.findById(potionId)
    //.populate('numberOfLikes').select('-password')
    .then((potionDetails) => {
      console.log(potionDetails);
      if (!potionDetails.numberOfLikes.includes(newWizard)) {
        Potion.findByIdAndUpdate(
          potionId,
          { $push: { numberOfLikes: newWizard } },
          { new: true }
        )
          .populate("wizard")
          .then((newPotionDetails) => {
            res.render("potions/potion", {
              potionDetails: newPotionDetails,
              wizardHasNotLiked: wizardHasNotLiked,
            });
          })
          .catch((err) => {
            console.log("Error removing potion...", err);
            next();
          });
      } else {
        console.log("has liked this already!!");
        Potion.findByIdAndUpdate(
          potionId,
          { $pull: { numberOfLikes: newWizard } },
          { new: true }
        )
          .populate("wizard")
          .then((newPotionDetails) => {
            wizardHasNotLiked = false;
            res.render("potions/potion", {
              potionDetails: newPotionDetails,
              wizardHasNotLiked: wizardHasNotLiked,
            });
          })
          .catch((err) => {
            console.log("Error removing potion...", err);
            next();
          });
      }
    })
    .catch((err) => {
      console.log("Error liking potion...", err);
      next();
    });
});
