const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const { verifyUser, verifyAuthor } = require("../middlewares/authenticate");

/**
 * CREATE Question (Authenticated users only)
 */
router.post("/", verifyUser, questionController.createQuestion);

/**
 * GET all Questions (Public)
 */
router.get("/", questionController.getAllQuestions);

/**
 * GET Question by ID (Public)
 */
router.get("/:id", questionController.getQuestionById);

/**
 * UPDATE Question (Only author can update)
 */
router.put("/:id", verifyUser, verifyAuthor, questionController.updateQuestion);

/**
 * DELETE Question (Only author can delete)
 */
router.delete(
  "/:id",
  verifyUser,
  verifyAuthor,
  questionController.deleteQuestion,
);

module.exports = router;
