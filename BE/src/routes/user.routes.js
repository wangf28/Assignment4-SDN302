const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

// GET all users (Admin only)
router.get("/", verifyUser, verifyAdmin, userController.getAllUsers);

module.exports = router;
