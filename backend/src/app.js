// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const storeRoutes = require("./routes/store.routes");
const ownerRoutes = require("./routes/owner.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route (server only)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// DB health check route
app.get("/db-health", async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      status: "ok",
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DB health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Auth routes
app.use("/auth", authRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Store routes
app.use("/stores", storeRoutes);

// Owner routes
app.use("/owner", ownerRoutes);

module.exports = app;
