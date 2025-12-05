const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route: get current user info from token
router.get("/me", authenticate, (req, res) => {
  // req.user is set in middleware
  res.json({
    message: "Current user",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
