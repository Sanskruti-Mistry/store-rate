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
  }, [sortBy, sortOrder]); // search & page we handle via buttons

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
      // Update store in local state
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? {
                ...s,
                avgRating: res.avgRating,
                myRating: res.rating.value,
              }
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
    <div>
      <h2 style={{ marginBottom: "8px" }}>Stores (User View)</h2>
      <p style={{ marginBottom: "12px", color: "#555", fontSize: "13px" }}>
        You can rate each store from 1 to 5. Overall rating is the average of
        all users.
      </p>

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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="createdAt">Sort by Created At</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={selectStyle}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <button type="submit" style={buttonStyle("#2563eb")}>
          Search
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
                <th style={thStyle}>Avg Rating</th>
                <th style={thStyle}>My Rating</th>
                <th style={thStyle}>Set Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td style={tdStyle}>{store.id}</td>
                  <td style={tdStyle}>{store.name}</td>
                  <td style={tdStyle}>{store.email || "-"}</td>
                  <td style={tdStyle}>{store.address}</td>
                  <td style={tdStyle}>
                    {store.avgRating == null ? "—" : store.avgRating.toFixed(1)}
                  </td>
                  <td style={tdStyle}>
                    {store.myRating == null ? "—" : store.myRating}
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={store.myRating || ""}
                      onChange={(e) =>
                        handleRatingChange(store.id, e.target.value)
                      }
                      disabled={ratingLoadingId === store.id}
                      style={{
                        ...selectStyle,
                        minWidth: "80px",
                      }}
                    >
                      <option value="">
                        {store.myRating == null ? "Rate…" : "Change…"}
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
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
