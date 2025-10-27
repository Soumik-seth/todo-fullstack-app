require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Enhanced MongoDB connection with better error handling
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
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.message.includes("authentication failed")) {
      console.log("💡 Solution: Check your MongoDB Atlas username and password in the connection string");
    } else if (error.message.includes("whitelist")) {
      console.log("💡 Solution: Add 0.0.0.0/0 to MongoDB Atlas IP whitelist");
    } else if (error.message.includes("MONGO_URI")) {
      console.log("💡 Solution: Set MONGO_URI environment variable in Vercel");
    } else if (error.message.includes("getaddrinfo")) {
      console.log("💡 Solution: Check your MongoDB cluster URL in the connection string");
    }
    
    // Don't exit in production - let the server start and retry
    console.log("🔄 Server will continue running but database operations will fail");
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Health check endpoint with database status
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusText = "Unknown";
  
  switch(dbStatus) {
    case 0: dbStatusText = "Disconnected"; break;
    case 1: dbStatusText = "Connected"; break;
    case 2: dbStatusText = "Connecting"; break;
    case 3: dbStatusText = "Disconnecting"; break;
  }
  
  res.json({ 
    status: "OK", 
    database: dbStatusText,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));