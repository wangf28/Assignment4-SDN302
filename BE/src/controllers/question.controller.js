const Question = require("../models/Question");

// Create new question
exports.createQuestion = async (req, res) => {
  try {
    const { text, options, keywords, correctAnswerIndex } = req.body;

    // Validate required fields
    if (!text || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "text, options, and correctAnswerIndex are required",
      });
    }

    // Create question with author from authenticated user
    const question = await Question.create({
      text,
      options,
      keywords,
      correctAnswerIndex,
      author: req.user._id, // Set author from authenticated user
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating question",
      error: error.message,
    });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author", "username");
    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "author",
      "username",
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching question",
      error: error.message,
    });
  }
};

// Update question (only by author)
exports.updateQuestion = async (req, res) => {
  try {
    const { text, options, keywords, correctAnswerIndex } = req.body;

    // Build update object (don't allow updating author)
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (options !== undefined) updateData.options = options;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (correctAnswerIndex !== undefined)
      updateData.correctAnswerIndex = correctAnswerIndex;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("author", "username");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating question",
      error: error.message,
    });
  }
};

// Delete question (only by author)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting question",
      error: error.message,
    });
  }
};
