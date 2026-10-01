const express = require("express");

const {
    home,
    register,
    login,
    logout
} = require("../controllers/userControllers");

const router = express.Router();


// Home / current user
router.get("/home", home);


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Logout
router.post("/logout", logout);


module.exports = router;