// src/routes/admin.routes.js
const express = require("express");
const router = express.Router();

const {
  createUser,
  listUsers,
  getUserById,
  createStore,
  listStores,
  dashboard,
} = require("../controllers/admin.controller");

const { authenticate, requireRole } = require("../middleware/auth.middleware");

// All routes here require ADMIN role
router.use(authenticate, requireRole("ADMIN"));

router.post("/users", createUser);
router.get("/users", listUsers);
router.get("/users/:id", getUserById);

router.post("/stores", createStore);
router.get("/stores", listStores);

router.get("/dashboard", dashboard);

module.exports = router;
