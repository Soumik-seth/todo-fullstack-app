require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo-auth";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));