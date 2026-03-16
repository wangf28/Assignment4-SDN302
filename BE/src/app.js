const express = require("express");
const app = express();

require("dotenv").config();

// CORS middleware - allow FE to call API
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL, // Vercel URL
  ].filter(Boolean); // Remove undefined values

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
// test middleware
app.use((req, res, next) => {
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/questions", require("./routes/question.routes"));
app.use("/api/quizzes", require("./routes/quiz.routes"));

// 404 handler - route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler - catch all errors
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
