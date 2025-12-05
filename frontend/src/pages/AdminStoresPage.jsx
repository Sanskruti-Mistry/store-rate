// src/pages/AdminStoresPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetStores, adminCreateStore } from "../api/client";

export default function AdminStoresPage() {
  const { token } = useAuth();

  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [ownerIdFilter, setOwnerIdFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const loadStores = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminGetStores(token, {
        page,
        pageSize: pagination.pageSize,
        search: search.trim() || undefined,
        ownerId: ownerIdFilter || undefined,
        sortBy,
        sortOrder,
      });
      setStores(res.data || []);
      setPagination(res.pagination || pagination);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder, ownerIdFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStores(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadStores(newPage);
  };

  const handleNewStoreChange = (e) => {
    setNewStore((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setCreateError(null);
    try {
      const payload = {
        name: newStore.name,
        email: newStore.email || null,
        address: newStore.address,
        ownerId: newStore.ownerId ? Number(newStore.ownerId) : null,
      };
      await adminCreateStore(token, payload);
      setNewStore({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });
      loadStores(1);
    } catch (err) {
      console.error(err);
      setCreateError(err.message || "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "8px" }}>Admin – Stores</h2>
      <p style={{ marginBottom: "12px", color: "#555", fontSize: "13px" }}>
        Create and manage stores. <br />
        <span style={{ fontSize: "12px" }}>
          To assign an owner, provide an <code>ownerId</code> that belongs to a
          user with role <code>OWNER</code> (see Admin Users page).
        </span>
      </p>

      {/* Create store form */}
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
          Create New Store
        </summary>
        <div style={{ padding: "12px" }}>
          <form
            onSubmit={handleCreateStore}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "8px 12px",
              alignItems: "flex-start",
            }}
          >
            <div>
              <label style={labelStyle}>Store Name</label>
              <input
                type="text"
                name="name"
                value={newStore.name}
                onChange={handleNewStoreChange}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Store Email (optional)</label>
              <input
                type="email"
                name="email"
                value={newStore.email}
                onChange={handleNewStoreChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Owner ID (optional)</label>
              <input
                type="number"
                name="ownerId"
                value={newStore.ownerId}
                onChange={handleNewStoreChange}
                style={inputStyle}
              />
              <div style={helperTextStyle}>
                Must be the ID of a user with role <code>OWNER</code> (see Admin
                Users).
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Address</label>
              <textarea
                name="address"
                value={newStore.address}
                onChange={handleNewStoreChange}
                style={{ ...inputStyle, height: "60px", resize: "vertical" }}
                required
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
                {creating ? "Creating..." : "Create Store"}
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
        <input
          type="number"
          placeholder="Filter by ownerId"
          value={ownerIdFilter}
          onChange={(e) => setOwnerIdFilter(e.target.value)}
          style={{
            width: "140px",
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #d4d4d4",
            fontSize: "14px",
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="createdAt">Sort by Created At</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
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
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
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
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Owner</th>
                <th style={thStyle}>Avg Rating</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td style={tdStyle}>{store.id}</td>
                  <td style={tdStyle}>{store.name}</td>
                  <td style={tdStyle}>{store.email || "—"}</td>
                  <td style={tdStyle}>{store.address}</td>
                  <td style={tdStyle}>
                    {store.owner
                      ? `${store.owner.name} (${store.owner.email})`
                      : "—"}
                  </td>
                  <td style={tdStyle}>
                    {store.avgRating == null ? "—" : store.avgRating.toFixed(1)}
                  </td>
                  <td style={tdStyle}>
                    {store.createdAt
                      ? new Date(store.createdAt).toLocaleString()
                      : "—"}
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
const helperTextStyle = {
  marginTop: "4px",
  fontSize: "12px",
  color: "#6b7280",
};
