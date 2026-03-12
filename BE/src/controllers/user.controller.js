const User = require("../models/User");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Get all users but exclude password field
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
