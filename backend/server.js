require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Secure & Proper CORS Setup
app.use(
  cors({
    origin:"https://todo-frontend-soumik-seths-projects.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection with Error Handling
const connectDB = async () => {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI environment variable is not defined");
    }

    console.log("📡 MongoDB URI found, connecting...");

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.message.includes("authentication failed")) {
      console.log("💡 Solution: Check your MongoDB Atlas username/password in the connection string");
    } else if (error.message.includes("whitelist")) {
      console.log("💡 Solution: Add 0.0.0.0/0 to MongoDB Atlas IP whitelist");
    } else if (error.message.includes("MONGO_URI")) {
      console.log("💡 Solution: Set MONGO_URI environment variable in Render");
    } else if (error.message.includes("getaddrinfo")) {
      console.log("💡 Solution: Check your MongoDB cluster URL in the connection string");
    }

    console.log("🔄 Server will continue running but database operations may fail");
  }
};

// Connect to database
connectDB();

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  const dbStatusText = dbStates[dbStatus] || "Unknown";

  res.json({
    status: "OK",
    database: dbStatusText,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully on Render!");
});

// ✅ Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
