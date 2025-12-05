// src/pages/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetUsers, adminCreateUser } from "../api/client";

export default function AdminUsersPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const loadUsers = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminGetUsers(token, {
        page,
        pageSize: pagination.pageSize,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
      });
      setUsers(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadUsers(newPage);
  };

  const handleNewUserChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setCreateError(null);
    try {
      await adminCreateUser(token, newUser);
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
      // refresh list
      loadUsers(1);
    } catch (err) {
      console.error(err);
      setCreateError(err.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "8px" }}>Admin – Users</h2>
      <p style={{ marginBottom: "12px", color: "#555", fontSize: "13px" }}>
        Create and manage users (ADMIN, OWNER, USER).
      </p>

      {/* Create user form */}
      <details
        open
        style={{
          marginBottom: "16px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            padding: "8px 12px",
            fontWeight: 500,
          }}
        >
          Create New User
        </summary>
        <div style={{ padding: "12px" }}>
          <form
            onSubmit={handleCreateUser}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "8px 12px",
              alignItems: "flex-start",
            }}
          >
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                style={inputStyle}
              >
                <option value="USER">USER</option>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Address (optional)</label>
              <textarea
                name="address"
                value={newUser.address}
                onChange={handleNewUserChange}
                style={{ ...inputStyle, height: "60px", resize: "vertical" }}
              />
            </div>

            {createError && (
              <div style={{ ...errorStyle, gridColumn: "1 / -1" }}>
                {createError}
              </div>
            )}

            <div style={{ gridColumn: "1 / -1", marginTop: "4px" }}>
              <button
                type="submit"
                disabled={creating}
                style={buttonStyle("#16a34a", creating)}
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </details>

      {/* Filters & search */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, email, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #d4d4d4",
            fontSize: "14px",
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="OWNER">OWNER</option>
          <option value="USER">USER</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="createdAt">Sort by Created At</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={selectStyle}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button type="submit" style={buttonStyle("#2563eb")}>
          Apply
        </button>
      </form>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>{u.address || "—"}</td>
                  <td style={tdStyle}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
          }}
        >
          <span>
            Page {pagination.page} of {pagination.totalPages} (total{" "}
            {pagination.total})
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={buttonStyle("#6b7280", pagination.page <= 1)}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              style={buttonStyle(
                "#6b7280",
                pagination.page >= pagination.totalPages
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #d4d4d4",
  fontSize: "14px",
};

const selectStyle = {
  padding: "6px 8px",
  borderRadius: "8px",
  border: "1px solid #d4d4d4",
  fontSize: "14px",
};

const buttonStyle = (bg, disabled) => ({
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: disabled ? "default" : "pointer",
  backgroundColor: disabled ? "#9ca3af" : bg,
  color: "white",
  fontWeight: 500,
});

const thStyle = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #f3f4f6",
  verticalAlign: "top",
};

const errorStyle = {
  marginBottom: "12px",
  padding: "8px 10px",
  borderRadius: "8px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "13px",
};
