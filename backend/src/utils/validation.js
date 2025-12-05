// src/utils/validation.js

// Name: 20–60 characters
function validateName(name) {
  if (typeof name !== "string") return "Name is required";
  const trimmed = name.trim();
  if (trimmed.length < 20) return "Name must be at least 20 characters long";
  if (trimmed.length > 60) return "Name must be at most 60 characters long";
  return null;
}

// Address: max 400 characters
function validateAddress(address) {
  if (address == null) return null; // optional
  if (typeof address !== "string") return "Address must be a string";
  if (address.length > 400)
    return "Address must be at most 400 characters long";
  return null;
}

// Basic email format check
function validateEmail(email) {
  if (typeof email !== "string") return "Email is required";
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Invalid email format";
  return null;
}

// Password: 8–16 chars, at least 1 uppercase & 1 special char
function validatePassword(password) {
  if (typeof password !== "string") return "Password is required";
  if (password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters long";
  }
  const uppercaseRegex = /[A-Z]/;
  const specialCharRegex = /[^A-Za-z0-9]/;

  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
};
