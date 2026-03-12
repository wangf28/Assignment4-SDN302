const Question = require("../models/Question");
const jwt = require("jsonwebtoken");

// Middleware to verify if user is authenticated
exports.verifyUser = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Add user info to request object
    req.user = {
      _id: decoded.id,
      admin: decoded.admin,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Middleware to verify if user has admin privileges
exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  if (req.user.admin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this operation!"
    });
  }
};

// Middleware to verify if user is the author of a question
exports.verifyAuthor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Get the question ID from request parameters
    const questionId = req.params.id || req.params.questionId;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID not provided"
      });
    }

    // Retrieve the question from database
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // Compare the author's ObjectId with the user's ObjectId
    if (question.author.toString() === req.user._id.toString()) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not the author of this question"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
