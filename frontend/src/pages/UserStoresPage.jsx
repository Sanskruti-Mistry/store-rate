// src/pages/UserStoresPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getStores, rateStore } from "../api/client";

export default function UserStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [ratingLoadingId, setRatingLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const loadStores = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getStores(token, {
        page,
        pageSize: pagination.pageSize,
        search: search.trim() || undefined,
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
  }, [sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStores(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadStores(newPage);
  };
  const handleRatingChange = async (storeId, newValue) => {
    if (!token) return;
    const value = parseInt(newValue, 10);
    if (isNaN(value) || value < 1 || value > 5) return;
    setRatingLoadingId(storeId);
    setError(null);
    try {
      const res = await rateStore(token, storeId, value);
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? { ...s, avgRating: res.avgRating, myRating: res.rating.value }
            : s
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save rating");
    } finally {
      setRatingLoadingId(null);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Browse Stores</h2>
        <p style={styles.subtitle}>Find and rate your favorite local spots.</p>
      </header>

      <div style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.toolbarForm}>
          <input
            type="text"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="name">Sort: Name</option>
            <option value="email">Sort: Email</option>
            <option value="createdAt">Sort: Date</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.select}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button type="submit" style={styles.primaryBtn}>
            Search
          </button>
        </form>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading ? (
        <p style={{ color: "#6B7280" }}>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p style={{ color: "#6B7280" }}>No stores found.</p>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Your Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} style={styles.trBody}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "600", color: "#111827" }}>
                      {store.name}
                    </div>
                  </td>
                  <td style={styles.td}>{store.email || "—"}</td>
                  <td style={styles.td}>
                    <div style={styles.address}>{store.address}</div>
                  </td>
                  <td style={styles.td}>
                    {store.avgRating != null ? (
                      <span style={styles.avgBadge}>
                        ★ {store.avgRating.toFixed(1)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={styles.td}>
                    <select
                      value={store.myRating || ""}
                      onChange={(e) =>
                        handleRatingChange(store.id, e.target.value)
                      }
                      disabled={ratingLoadingId === store.id}
                      style={{
                        ...styles.ratingSelect,
                        borderColor: store.myRating ? "#F59E0B" : "#D1D5DB",
                      }}
                    >
                      <option value="">Rate...</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <span style={styles.pageText}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={pagination.page <= 1 ? styles.btnDisabled : styles.btn}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              style={
                pagination.page >= pagination.totalPages
                  ? styles.btnDisabled
                  : styles.btn
              }
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
  header: { marginBottom: "24px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" },
  subtitle: { fontSize: "14px", color: "#6B7280", margin: 0 },
  toolbar: { marginBottom: "20px" },
  toolbarForm: { display: "flex", gap: "10px", flexWrap: "wrap" },
  searchInput: { flex: 1, minWidth: "220px", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "8px" },
  select: { padding: "10px", border: "1px solid #D1D5DB", borderRadius: "8px", backgroundColor: "white" },
  primaryBtn: { padding: "10px 20px", backgroundColor: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  errorBox: { padding: "12px", backgroundColor: "#FEE2E2", color: "#991B1B", borderRadius: "8px", marginBottom: "16px" },
  tableCard: { backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", overflowX: "auto", border: "1px solid #E5E7EB" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  trHead: { backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
  th: { padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" },
  trBody: { borderBottom: "1px solid #F3F4F6" },
  td: { padding: "16px", color: "#374151", verticalAlign: "middle" },
  address: { fontSize: "13px", color: "#6B7280", maxWidth: "250px" },
  avgBadge: { backgroundColor: "#FFFBEB", color: "#B45309", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", fontSize: "13px" },
  ratingSelect: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #D1D5DB", cursor: "pointer", fontSize: "13px" },
  pagination: { marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageText: { fontSize: "14px", color: "#6B7280" },
  btn: { padding: "8px 16px", backgroundColor: "white", border: "1px solid #D1D5DB", borderRadius: "8px", cursor: "pointer", fontWeight: "500", color: "#374151" },
  btnDisabled: { padding: "8px 16px", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "8px", cursor: "not-allowed", color: "#9CA3AF" },
};