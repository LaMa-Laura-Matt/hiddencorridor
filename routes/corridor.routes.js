const express = require("express");
const router = express.Router();

// User Profile
router.get('/entrance-hall', (req, res, next) => {
    console.log("welcome to the GH")
    res.render("corridor/entrance-hall");
});

module.exports = router;