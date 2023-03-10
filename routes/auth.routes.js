const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the Wizard model in order to interact with the database
const Wizard = require("../models/Wizard.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res) => {
  const {
    Wizardname,
    name,
    password,
    confirmPassword,
    firstYearOfHogwarts,
    house,
  } = req.body;

  // Check that Wizardname, email, and password are provided
  if (
    Wizardname === "" ||
    name === "" ||
    password === "" ||
    firstYearOfHogwarts === "" ||
    house === ""
  ) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your Wizardname, name, house, first year at Hogwarts and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  if (password !== confirmPassword) {
    res.status(400).render("auth/signup", {
      errorMessage: "Both passwords must match",
    });

    return;
  }

  // Create a new Wizard - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a Wizard and save it in the database
      return Wizard.create({
        Wizardname,
        name,
        password: hashedPassword,
        firstYearOfHogwarts,
        house,
      });
    })
    .then((Wizard) => {
      res.redirect("/auth/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Wizardname is taken, please try again.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { Wizardname, password } = req.body;

  // Check that Wizardname, and password are provided
  if (Wizardname === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide Wizardname and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a Wizard with the email submitted in the form
  Wizard.findOne({ Wizardname })
    .then((Wizard) => {
      // If the Wizard isn't found, send an error message that Wizard provided wrong credentials
      if (!Wizard) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If Wizard is found based on the Wizardname, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, Wizard.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the Wizard object to the session object
          req.session.currentWizard = Wizard.toObject();
          // Remove the password field
          delete req.session.currentWizard.password;

          res.redirect(`/auth/profile/${Wizard._id}`);
          //res.render(`auth/profile/${Wizard._id}`, { userInSession: req.session.currentWizard });
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

//Profile Page
router.get("/profile/:wizardId", isLoggedIn, (req, res, next) => {
  const wizardId = req.params.wizardId;

  Wizard.findById(wizardId)
    //.populate("potion")
    .then((wizardDetails) => {
      if (wizardDetails._id.toString() !== req.session.currentWizard._id) {
        res.redirect("/auth/login");
      }
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
      res.render("auth/profile", {
        wizard: wizardDetails,
        gryffindor: gryffindor,
        hufflepuff: hufflepuff,
        ravenclaw: ravenclaw,
        slytherin: slytherin,
      });
    })
    .catch((err) => {
      console.log(
        "error getting wizard details for profile page  from DB",
        err
      );
      next();
    });
});

//display the update user form
router.get("/profile/:profileId/edit", isLoggedIn, (req, res, next) => {
  const id = req.params.profileId;

  Wizard.findById(id)
    .then((userDetails) => {
      console.log(userDetails);

      res.render("auth/profile-edit", userDetails);
    })
    .catch((err) => {
      console.log("Error getting user details from DB...", err);
      next();
    });
});
module.exports = router;

//UPDATE: process form
router.post("/profile/:profileId/edit", isLoggedIn, (req, res, next) => {
  const profileId = req.params.profileId;

  const newDetails = {
    name: req.body.name,
    firstYearOfHogwarts: req.body.firstYearOfHogwarts,
    house: req.body.house,
  };

  Wizard.findByIdAndUpdate(profileId, newDetails, { new: true })
    .then((updatedDetails) => {
      if (updatedDetails._id.toString() !== req.session.currentWizard._id) {
        res.redirect("/auth/login");
      }
      // Add the Wizard object to the session object
      req.session.currentWizard = updatedDetails.toObject();
      // Remove the password field
      delete req.session.currentWizard.password;
     
      res.redirect("/auth/profile/" + profileId);
    })
    .catch((err) => {
      console.log("Error updating wizard...", err);
      next();
    });
});

module.exports = router;
