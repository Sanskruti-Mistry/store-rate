// src/routes/owner.routes.js
const express = require("express");
const router = express.Router();

const {
  getMyStore,
  getMyStoreRatings,
} = require("../controllers/owner.controller");

const { authenticate, requireRole } = require("../middleware/auth.middleware");

// All owner routes require login + OWNER role
router.use(authenticate, requireRole("OWNER"));

router.get("/my-store", getMyStore);
router.get("/my-store/ratings", getMyStoreRatings);

module.exports = router;
