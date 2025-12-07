// src/api/client.js

const API_BASE = "http://localhost:3000"; // Ensure this matches your backend port

// Generic helper for requests
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || json.message || "API Request failed");
  }

  return json;
}

// --- AUTH API ---

export function signupUser(formData) {
  // We pass 'formData' directly so it includes name, email, password, AND role
  return apiRequest("/auth/signup", "POST", formData);
}

export function loginUser(formData) {
  return apiRequest("/auth/login", "POST", formData);
}

export function fetchCurrentUser(token) {
  return apiRequest("/auth/me", "GET", null, token);
}

// --- ADMIN API ---

export function adminGetDashboard(token) {
  return apiRequest("/admin/dashboard", "GET", null, token);
}

export function adminGetUsers(token, params = {}) {
  // Convert params object to query string
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/admin/users?${qs}`, "GET", null, token);
}

export function adminCreateUser(token, data) {
  return apiRequest("/admin/users", "POST", data, token);
}

export function adminGetStores(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/admin/stores?${qs}`, "GET", null, token);
}

export function adminCreateStore(token, data) {
  return apiRequest("/admin/stores", "POST", data, token);
}

// --- OWNER API ---

export function ownerGetMyStore(token) {
  return apiRequest("/owner/store", "GET", null, token);
}

export function ownerGetMyStoreRatings(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/owner/store/ratings?${qs}`, "GET", null, token);
}

// --- USER API ---

export function getStores(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/stores?${qs}`, "GET", null, token);
}

export function rateStore(token, storeId, value) {
  return apiRequest(`/stores/${storeId}/rate`, "POST", { value }, token);
}