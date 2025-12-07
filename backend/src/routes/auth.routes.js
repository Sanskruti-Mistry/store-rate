// src/routes/auth.js
const express = require("express");
const router = express.Router();

// 1. Import prisma to query the database
const prisma = require("../config/prisma");

const { signup, login } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route: Get full current user profile
router.get("/me", authenticate, async (req, res) => {
  try {
    // 2. Use the ID from the token (req.user.id) to find the full record in MongoDB
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3. Send back the full details so the frontend has 'name', 'address', etc.
    res.json({
      message: "Current user",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Me route error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;