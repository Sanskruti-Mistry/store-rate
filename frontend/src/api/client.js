// src/api/client.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data && data.error
        ? data.error
        : `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Health checks
export function checkBackendHealth() {
  return apiRequest("/health");
}

export function checkDbHealth() {
  return apiRequest("/db-health");
}

// ---- Auth APIs ----

export function signupUser(payload) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function fetchCurrentUser(token) {
  return apiRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ---- Store APIs (USER) ----

export function getStores(token, query = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const qs = params.toString();
  const path = qs ? `/stores?${qs}` : "/stores";

  return apiRequest(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function rateStore(token, storeId, value) {
  return apiRequest(`/stores/${storeId}/ratings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { value },
  });
}

export function getStoreDetails(token, storeId) {
  return apiRequest(`/stores/${storeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ---- Admin APIs ----

export function adminGetDashboard(token) {
  return apiRequest("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function adminGetUsers(token, query = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.role) params.set("role", query.role);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const qs = params.toString();
  const path = qs ? `/admin/users?${qs}` : "/admin/users";

  return apiRequest(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function adminCreateUser(token, payload) {
  // { name, email, password, address, role }
  return apiRequest("/admin/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

export function adminGetStores(token, query = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.ownerId) params.set("ownerId", String(query.ownerId));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const qs = params.toString();
  const path = qs ? `/admin/stores?${qs}` : "/admin/stores";

  return apiRequest(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function adminCreateStore(token, payload) {
  // { name, email, address, ownerId }
  return apiRequest("/admin/stores", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

// ---- Owner APIs ----

export function ownerGetMyStore(token) {
  return apiRequest("/owner/my-store", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function ownerGetMyStoreRatings(token, query = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const qs = params.toString();
  const path = qs ? `/owner/my-store/ratings?${qs}` : "/owner/my-store/ratings";

  return apiRequest(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { apiRequest, API_BASE_URL };
