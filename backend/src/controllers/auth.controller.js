// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client"); // Ensure this imports your Enum
const prisma = require("../config/prisma");

const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require("../utils/validation");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in .env");
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /auth/signup
async function signup(req, res) {
  try {
    // 1. Accept 'role' from the request body
    const { name, email, password, address, role } = req.body;

    // Validate fields
    const nameError = validateName(name);
    if (nameError) return res.status(400).json({ error: nameError });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const addressError = validateAddress(address);
    if (addressError) return res.status(400).json({ error: addressError });

    // 2. Validate Role (Ensure it's one of the allowed values)
    let assignedRole = Role.USER; // Default
    if (role) {
      if (["USER", "OWNER", "ADMIN"].includes(role)) {
        assignedRole = role;
      } else {
        return res.status(400).json({ error: "Invalid role selected" });
      }
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user with the selected role
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        passwordHash,
        address: address || null,
        role: assignedRole, // <--- Using the variable here
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Login remains the same...
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { signup, login };