const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// User registration and login
router.post("/register", authController.register);
router.post("/login", authController.login);

// Admin registration
router.post("/register-admin", authController.registerAdmin);

module.exports = router;
