// src/routes/store.routes.js
const express = require("express");
const router = express.Router();

const {
  listStoresForUser,
  getStoreByIdForUser,
  rateStore,
  getMyRatingForStore,
} = require("../controllers/store.controller");

const { authenticate, requireRole } = require("../middleware/auth.middleware");

// All /stores routes require login
router.use(authenticate);

// List/search stores (any logged-in role can see)
router.get("/", listStoresForUser);

// Store details + avg + my rating
router.get("/:id", getStoreByIdForUser);

// Create/update rating (only USER role should rate)
router.post("/:id/ratings", requireRole("USER"), rateStore);

// Get my rating for a store
router.get("/:id/my-rating", requireRole("USER"), getMyRatingForStore);

module.exports = router;
