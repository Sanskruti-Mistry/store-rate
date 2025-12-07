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
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      loadStores(1);
    } catch (err) {
      console.error(err);
      setCreateError(err.message || "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageHeader}>Store Management</h2>

      <details style={styles.detailsCard}>
        <summary style={styles.summary}>+ Create New Store</summary>
        <div style={styles.formContent}>
          <form onSubmit={handleCreateStore} style={styles.createForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Store Name</label>
              <input
                type="text"
                name="name"
                value={newStore.name}
                onChange={handleNewStoreChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={newStore.email}
                onChange={handleNewStoreChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Owner ID (Optional)</label>
              <input
                type="number"
                name="ownerId"
                value={newStore.ownerId}
                onChange={handleNewStoreChange}
                style={styles.input}
                placeholder="User ID of Owner"
              />
            </div>
            <div style={{ ...styles.formGroup, gridColumn: "1/-1" }}>
              <label style={styles.label}>Address</label>
              <textarea
                name="address"
                value={newStore.address}
                onChange={handleNewStoreChange}
                style={styles.textarea}
                required
              />
            </div>
            {createError && (
              <div style={{ ...styles.errorBox, gridColumn: "1/-1" }}>
                {createError}
              </div>
            )}
            <div style={{ gridColumn: "1/-1" }}>
              <button
                type="submit"
                disabled={creating}
                style={styles.createBtn}
              >
                {creating ? "Creating..." : "Create Store"}
              </button>
            </div>
          </form>
        </div>
      </details>

      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.toolbarForm}>
          <input
            type="text"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <input
            type="number"
            placeholder="Owner ID"
            value={ownerIdFilter}
            onChange={(e) => setOwnerIdFilter(e.target.value)}
            style={{ ...styles.searchInput, maxWidth: "100px" }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.toolbarSelect}
          >
            <option value="createdAt">Sort: Date</option>
            <option value="name">Sort: Name</option>
            <option value="email">Sort: Email</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.toolbarSelect}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <button type="submit" style={styles.filterBtn}>
            Apply
          </button>
        </form>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <p style={{ color: "#6B7280" }}>Loading...</p>
      ) : stores.length === 0 ? (
        <p style={{ padding: "20px", color: "#6B7280" }}>No stores found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} style={styles.tableRow}>
                  <td style={styles.td}>{store.id}</td>
                  <td style={{ ...styles.td, fontWeight: "500" }}>{store.name}</td>
                  <td style={styles.td}>{store.email || "—"}</td>
                  <td style={styles.td}>
                    <div style={styles.truncate}>{store.address}</div>
                  </td>
                  <td style={styles.td}>
                    {store.owner ? (
                      <div>
                        <div style={{ fontWeight: "500" }}>{store.owner.name}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>{store.owner.email}</div>
                      </div>
                    ) : (
                      <span style={{ color: "#9CA3AF" }}>No Owner</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {store.avgRating != null ? (
                      <span style={styles.ratingBadge}>★ {store.avgRating.toFixed(1)}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={styles.td}>
                    {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <span style={styles.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={pagination.page <= 1 ? styles.pageBtnDisabled : styles.pageBtn}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              style={pagination.page >= pagination.totalPages ? styles.pageBtnDisabled : styles.pageBtn}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "24px", backgroundColor: "#F9FAFB", minHeight: "100%" },
  pageHeader: { fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "20px" },
  detailsCard: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", marginBottom: "24px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  summary: { padding: "16px", cursor: "pointer", fontWeight: "600", color: "#4F46E5", backgroundColor: "#F9FAFB", outline: "none" },
  formContent: { padding: "20px", borderTop: "1px solid #E5E7EB" },
  createForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: { padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px" },
  textarea: { padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", minHeight: "60px" },
  createBtn: { padding: "10px 20px", backgroundColor: "#10B981", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  errorBox: { padding: "12px", backgroundColor: "#FEE2E2", color: "#991B1B", borderRadius: "6px", marginBottom: "16px" },
  toolbar: { marginBottom: "16px" },
  toolbarForm: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  searchInput: { flex: 1, minWidth: "200px", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", outline: "none" },
  toolbarSelect: { padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", cursor: "pointer" },
  filterBtn: { padding: "8px 16px", backgroundColor: "#4F46E5", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  tableWrapper: { backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto", border: "1px solid #E5E7EB" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  tableHeadRow: { backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" },
  tableRow: { borderBottom: "1px solid #F3F4F6" },
  td: { padding: "12px 16px", color: "#1F2937", verticalAlign: "middle" },
  truncate: { maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  ratingBadge: { backgroundColor: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: "99px", fontWeight: "600", fontSize: "12px" },
  pagination: { marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageInfo: { fontSize: "14px", color: "#6B7280" },
  pageBtn: { padding: "6px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", backgroundColor: "white", cursor: "pointer", color: "#374151" },
  pageBtnDisabled: { padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: "6px", backgroundColor: "#F3F4F6", cursor: "default", color: "#9CA3AF" },
};