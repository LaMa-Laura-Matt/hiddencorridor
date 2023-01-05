const express = require("express");
const router = express.Router();

//Entrance Hall
router.get('/entrance-hall', (req, res, next) => {
    console.log("welcome to the GH")
    res.render("corridor/entrance-hall");
});


// Hidden Corridor
router.get('/hidden-corridor', (req, res, next) => {
    console.log("welcome to the HC")
    res.render("corridor/hidden-corridor");
});
module.exports = router;