// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetDashboard } from "../api/client";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await adminGetDashboard(token);
        setData(res);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h2 style={{ marginBottom: "8px" }}>Admin Dashboard</h2>
      <p style={{ marginBottom: "16px", color: "#555", fontSize: "13px" }}>
        Overview of users, stores, and ratings.
      </p>

      {loading && <p>Loading dashboard...</p>}

      {error && <div style={errorStyle}>{error}</div>}

      {data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <StatCard label="Total Users" value={data.totalUsers} />
          <StatCard label="Total Stores" value={data.totalStores} />
          <StatCard label="Total Ratings" value={data.totalRatings} />
          <StatCard label="Admins" value={data.usersByRole?.ADMIN ?? 0} />
          <StatCard label="Owners" value={data.usersByRole?.OWNER ?? 0} />
          <StatCard label="Normal Users" value={data.usersByRole?.USER ?? 0} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        borderRadius: "10px",
        padding: "12px",
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "13px", color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const errorStyle = {
  marginBottom: "12px",
  padding: "8px 10px",
  borderRadius: "8px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "13px",
};
