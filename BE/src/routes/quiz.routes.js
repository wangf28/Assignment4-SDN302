const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

/**
 * CREATE Quiz (Admin only)
 */
router.post("/", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET all Quizzes (populate questions)
 */
router.get("/", async (req, res) => {
  const quizzes = await Quiz.find().populate("questions");
  res.json(quizzes);
});

/**
 * GET Quiz by ID
 */
router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate("questions");
  if (!quiz) return res.status(404).json({ message: "Not found" });
  res.json(quiz);
});

/**
 * UPDATE Quiz (metadata: title, description) - Admin only
 */
router.put("/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is required",
      });
    }

    const { title, description } = req.body;

    // Build update object
    const updateData = {};
    if (title !== undefined && title !== null) updateData.title = title;
    if (description !== undefined && description !== null)
      updateData.description = description;

    // Check nếu không có gì để update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Please provide title or description to update",
      });
    }

    // Update quiz
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (err) {
    console.error("UPDATE QUIZ ERROR:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

/**
 * DELETE Quiz (Admin only)
 */
router.delete("/:id", verifyUser, verifyAdmin, async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;

/**
 * ADD Question to Quiz (Admin only)
 */

router.post("/:quizId/questions", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        error: "questionId is required",
      });
    }

    // Check quiz tồn tại
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found",
      });
    }

    // Check question tồn tại
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        error: "Question not found",
      });
    }

    // Không cho add trùng
    if (quiz.questions.includes(questionId)) {
      return res.status(409).json({
        error: "Question already exists in quiz",
      });
    }

    quiz.questions.push(questionId);
    await quiz.save();

    res.status(200).json({
      message: "Question added to quiz successfully",
      quiz,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
