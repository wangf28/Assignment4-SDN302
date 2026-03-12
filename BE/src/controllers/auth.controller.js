const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    { id: userId, admin: isAdmin },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const user = new User({
      username,
      password,
      admin: false,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.admin);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        admin: user.admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id, user.admin);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        admin: user.admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register admin user
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new admin user
    const user = new User({
      username,
      password,
      admin: true,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.admin);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        admin: user.admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
