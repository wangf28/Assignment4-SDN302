const app = require("./app");
const PORT = process.env.PORT || 3000;
const connectDB = require("./configs/database");

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
