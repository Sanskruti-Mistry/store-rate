// src/pages/OwnerStorePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { ownerGetMyStore, ownerGetMyStoreRatings } from "../api/client";

export default function OwnerStorePage() {
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [storeError, setStoreError] = useState(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingsPagination, setRatingsPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);

  useEffect(() => {
    async function loadStore() {
      if (!token) return;
      setStoreLoading(true);
      setStoreError(null);
      try {
        const res = await ownerGetMyStore(token);
        setStore(res);
      } catch (err) {
        console.error(err);
        setStoreError(err.message || "Failed to load store");
      } finally {
        setStoreLoading(false);
      }
    }
    loadStore();
  }, [token]);

  const loadRatings = async (page = 1) => {
    if (!token) return;
    setRatingsLoading(true);
    setRatingsError(null);
    try {
      const res = await ownerGetMyStoreRatings(token, {
        page,
        pageSize: ratingsPagination.pageSize,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setRatings(res.data || []);
      setRatingsPagination(res.pagination || ratingsPagination);
    } catch (err) {
      console.error(err);
      setRatingsError(err.message || "Failed to load ratings");
    } finally {
      setRatingsLoading(false);
    }
  };

  useEffect(() => {
    loadRatings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRatingsPageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > ratingsPagination.totalPages ||
      ratingsPagination.totalPages === 0
    )
      return;
    loadRatings(newPage);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Store Management</h2>

      {/* Store details */}
      {storeLoading ? (
        <p>Loading store...</p>
      ) : storeError ? (
        <div style={styles.errorBanner}>{storeError}</div>
      ) : store ? (
        <div style={styles.storeCard}>
          <div style={styles.storeHeader}>
            <div style={styles.storeIcon}>🏪</div>
            <div>
              <h3 style={styles.storeName}>{store.name}</h3>
              <p style={styles.storeId}>Store ID: #{store.id}</p>
            </div>
          </div>
          <div style={styles.storeGrid}>
            <div style={styles.infoBlock}>
              <div style={styles.label}>Contact Email</div>
              <div style={styles.value}>{store.email || "—"}</div>
            </div>
            <div style={styles.infoBlock}>
              <div style={styles.label}>Address</div>
              <div style={styles.value}>{store.address}</div>
            </div>
            <div style={styles.infoBlock}>
              <div style={styles.label}>Performance</div>
              <div style={styles.ratingValue}>
                ★ {store.avgRating == null ? "—" : store.avgRating.toFixed(1)}
                <span style={styles.ratingCount}>
                  {" "}
                  ({store.totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>No store assigned to you yet.</div>
      )}

      {/* Ratings list */}
      <h3 style={styles.sectionTitle}>Customer Ratings</h3>

      {ratingsLoading ? (
        <p>Loading ratings...</p>
      ) : ratingsError ? (
        <div style={styles.errorBanner}>{ratingsError}</div>
      ) : ratings.length === 0 ? (
        <div style={styles.emptyState}>No ratings received yet.</div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHead}>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id} style={styles.trBody}>
                  <td style={styles.td}>
                    {r.user ? (
                      <div>
                        <div style={{ fontWeight: "500" }}>{r.user.name}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                          {r.user.email}
                        </div>
                      </div>
                    ) : (
                      `User #${r.userId}`
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.starBadge}>
                      {Array.from({ length: r.value }).map((_, i) => "★")}
                      <span style={{ color: "#D1D5DB" }}>
                        {Array.from({ length: 5 - r.value }).map((_, i) => "★")}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ratingsPagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <span style={styles.pageInfo}>
            Page {ratingsPagination.page} of {ratingsPagination.totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleRatingsPageChange(ratingsPagination.page - 1)}
              disabled={ratingsPagination.page <= 1}
              style={ratingsPagination.page <= 1 ? styles.btnDisabled : styles.btn}
            >
              Prev
            </button>
            <button
              onClick={() => handleRatingsPageChange(ratingsPagination.page + 1)}
              disabled={ratingsPagination.page >= ratingsPagination.totalPages}
              style={ratingsPagination.page >= ratingsPagination.totalPages ? styles.btnDisabled : styles.btn}
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
  container: { padding: "32px", backgroundColor: "#F9FAFB", minHeight: "100%" },
  pageTitle: { fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "24px" },
  errorBanner: { padding: "12px", backgroundColor: "#FEE2E2", color: "#991B1B", borderRadius: "8px", marginBottom: "16px" },
  emptyState: { padding: "20px", color: "#6B7280", fontStyle: "italic", border: "1px dashed #D1D5DB", borderRadius: "8px" },
  
  storeCard: {
    backgroundColor: "white", borderRadius: "12px", padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px", border: "1px solid #E5E7EB"
  },
  storeHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  storeIcon: { fontSize: "32px", padding: "12px", backgroundColor: "#EEF2FF", borderRadius: "12px" },
  storeName: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#1F2937" },
  storeId: { fontSize: "14px", color: "#6B7280", margin: "4px 0 0 0" },
  storeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" },
  infoBlock: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" },
  value: { fontSize: "16px", color: "#111827" },
  ratingValue: { fontSize: "18px", fontWeight: "700", color: "#D97706" },
  ratingCount: { fontSize: "14px", fontWeight: "400", color: "#6B7280" },
  
  sectionTitle: { fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "16px" },
  tableCard: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  trHead: { backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" },
  trBody: { borderBottom: "1px solid #F3F4F6" },
  td: { padding: "12px 16px", color: "#374151" },
  starBadge: { color: "#F59E0B", fontSize: "16px", letterSpacing: "1px" },
  
  pagination: { marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageInfo: { fontSize: "14px", color: "#6B7280" },
  btn: { padding: "8px 16px", backgroundColor: "white", border: "1px solid #D1D5DB", borderRadius: "6px", cursor: "pointer", color: "#374151" },
  btnDisabled: { padding: "8px 16px", backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "6px", cursor: "default", color: "#9CA3AF" },
};