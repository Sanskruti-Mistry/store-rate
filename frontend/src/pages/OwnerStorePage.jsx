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
    <div>
      <h2 style={{ marginBottom: "8px" }}>Owner – My Store</h2>
      <p style={{ marginBottom: "12px", color: "#555", fontSize: "13px" }}>
        View your store details and ratings from users.
      </p>

      {/* Store details */}
      {storeLoading ? (
        <p>Loading store...</p>
      ) : storeError ? (
        <div style={errorStyle}>{storeError}</div>
      ) : store ? (
        <div style={storeCardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "4px" }}>{store.name}</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            ID: {store.id}
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Email: {store.email || "—"}
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Address: {store.address}
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Avg Rating:{" "}
            {store.avgRating == null ? "—" : store.avgRating.toFixed(1)} (
            {store.totalRatings} ratings)
          </p>
        </div>
      ) : (
        <p>No store assigned to this owner.</p>
      )}

      {/* Ratings list */}
      <h3 style={{ marginTop: "16px", marginBottom: "8px" }}>Ratings</h3>

      {ratingsLoading ? (
        <p>Loading ratings...</p>
      ) : ratingsError ? (
        <div style={errorStyle}>{ratingsError}</div>
      ) : ratings.length === 0 ? (
        <p>No ratings yet.</p>
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
                <th style={thStyle}>User</th>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id}>
                  <td style={tdStyle}>{r.id}</td>
                  <td style={tdStyle}>
                    {r.user
                      ? `${r.user.name} (${r.user.email})`
                      : `User #${r.userId}`}
                  </td>
                  <td style={tdStyle}>{r.value}</td>
                  <td style={tdStyle}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ratingsPagination.totalPages > 1 && (
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
            Page {ratingsPagination.page} of {ratingsPagination.totalPages}{" "}
            (total {ratingsPagination.total})
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() =>
                handleRatingsPageChange(ratingsPagination.page - 1)
              }
              disabled={ratingsPagination.page <= 1}
              style={buttonStyle("#6b7280", ratingsPagination.page <= 1)}
            >
              Prev
            </button>
            <button
              onClick={() =>
                handleRatingsPageChange(ratingsPagination.page + 1)
              }
              disabled={ratingsPagination.page >= ratingsPagination.totalPages}
              style={buttonStyle(
                "#6b7280",
                ratingsPagination.page >= ratingsPagination.totalPages
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

const storeCardStyle = {
  borderRadius: "10px",
  padding: "12px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
};

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

const buttonStyle = (bg, disabled) => ({
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  cursor: disabled ? "default" : "pointer",
  backgroundColor: disabled ? "#9ca3af" : bg,
  color: "white",
  fontWeight: 500,
});
