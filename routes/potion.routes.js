const express = require("express");
const router = express.Router();
const Potion = require("../models/Potion.model");
const Wizard = require("../models/Wizard.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const isPotionOwner = require("../middleware/isOwner");

// PotionsRoom
router.get("/potions", isLoggedIn, (req, res, next) => {
  //here we will list the potions so will need to do a .find())

  Potion.find()
    .populate("wizard")
    .then((potionsFromDB) => {
      res.render("potions/potion-list", { potions: potionsFromDB });
    })
    .catch((err) => {
      console.log("error getting potions from DB", err);
      next(err);
    });
});
/*
if (req.session.currentWizard.house === "gryffindor") {
        gryffindor = true;
      } else if (req.session.currentWizard.house === "hufflepuff") {
        hufflepuff = true;
      } else if (req.session.currentWizard.house === "ravenclaw") {
        ravenclaw = true;
      } else if (req.session.currentWizard.house === "slytherin") {
        slytherin = true;
      }
      res.render("auth/profile", { wizard: wizardDetails, gryffindor: gryffindor,  hufflepuff: hufflepuff, ravenclaw: ravenclaw, slytherin: slytherin,});
    })
*/

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
  console.log(newPotion);

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
      if (
        req.session.currentWizard.Wizardname === potionDetails.wizard.Wizardname
      ) {
        isOwner = true;
      }

      res.render("potions/potion", {
        potionDetails: potionDetails,
        isOwner: isOwner,
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
let wizardHasNotLiked = false;

Potion.findById(potionId)
//.populate('numberOfLikes').select('-password')
  .then((potionDetails) => {
  console.log(potionDetails);
  if (!potionDetails.numberOfLikes.includes(newWizard)) {
    console.log("has not like this yet");
    Potion.findByIdAndUpdate(potionId, { $push: { numberOfLikes: newWizard }}, { new: true } )
    .then((newPotionDetails) => {
      res.render("potions/potion", { potionDetails: newPotionDetails, wizardHasLiked: wizardHasLiked});
    })
    .catch((err) => {
      console.log("Error removing potion...", err);
      next();
    });
  } else {
    console.log("has liked this already!!");
    Potion.findByIdAndUpdate(potionId, { $pull: { numberOfLikes: newWizard }}, { new: true } )
    .then((newPotionDetails) => {
      wizardHasNotLiked = true;
      res.render("potions/potion", { potionDetails: newPotionDetails, wizardHasNotLiked: wizardHasNotLiked});
        // This didnt work AGAIN!! (`potions/${potionId}`);
    })
    .catch((err) => {
      console.log("Error removing potion...", err);
      next();
    });
  }
    // console.log('This is the result of the .includes() => ', potionDetails.numberOfLikes.includes(newWizard))
    // check if the wiz is in the array
    // If not  Potion.findByIdAndUpdate(potionId, { $push: { numberOfLikes: newWizard }}, { new: true } )
    // If it's in the array Potion.findByIdAndUpdate(potionId, { $pull: { numberOfLikes: newWizard }}, { new: true } )
  
})
.catch((err) => {
  console.log("Error liking potion...", err);
  next();
});
/*
  Potion.findByIdAndUpdate(potionId, { $push: { numberOfLikes: newWizard }}, { new: true } )
    .then((potionDetails) => {
      console.log(potionDetails);
      console.log('This is the result of the .includes() => ', potionDetails.numberOfLikes.includes(newWizard))
      res.redirect("/potions/");
        // This didnt work AGAIN!! (`potions/${potionId}`);
    })
    .catch((err) => {
      console.log("Error liking potion...", err);
      next();
    });
    */
/*
    const newDetails = {
      numberOfLikes: newLikeArr,
    }
    console.log(newDetails);

    Potion.findByIdAndUpdate(potionId, newDetails)
    .then(() => {
      res.redirect("/potions/");
      // This didnt work !! (`potions/${potionId}`);
    })
    .catch((err) => {
      console.log("Error updating potion...", err);
      next();
    });
*/
});
/*
      potionDetails.numberOfLikes.forEach((wizardId) => {
        console.log(wizardId);

        if (wizardId._id !== req.session.currentWizard._id) {
          console.log(potionDetails.numberOfLikes);
          newLikeArr = potionDetails.numberOfLikes.push(req.session.currentWizard);
          console.log("This is the new Array" + newLikeArr);
        } else {
          let index = potionDetails.numberOfLikes.indexOf(wizardId);
          if (index > -1) {
            let newLikeArr = potionDetails.numberOfLikes.splice(index, 1);
          }
        }
      });
      */
