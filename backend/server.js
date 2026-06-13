const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Management API Running",
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});