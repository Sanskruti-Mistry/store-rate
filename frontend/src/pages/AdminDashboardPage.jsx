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
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Admin Dashboard</h2>
        <p style={styles.pageSubtitle}>Overview of platform statistics.</p>
      </header>

      {loading && <p style={styles.infoText}>Loading data...</p>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {data && (
        <div style={styles.grid}>
          <StatCard
            label="Total Users"
            value={data.totalUsers}
            color="#4F46E5"
          />
          <StatCard
            label="Total Stores"
            value={data.totalStores}
            color="#10B981"
          />
          <StatCard
            label="Total Ratings"
            value={data.totalRatings}
            color="#F59E0B"
          />
          
          <div style={styles.separator} />
          
          <StatCard
            label="Admins"
            value={data.usersByRole?.ADMIN ?? 0}
            color="#EF4444"
            small
          />
          <StatCard
            label="Owners"
            value={data.usersByRole?.OWNER ?? 0}
            color="#8B5CF6"
            small
          />
          <StatCard
            label="Regular Users"
            value={data.usersByRole?.USER ?? 0}
            color="#6B7280"
            small
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, small }) {
  return (
    <div
      style={{
        ...styles.card,
        borderTop: `4px solid ${color}`,
        gridColumn: small ? "span 1" : undefined,
      }}
    >
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color: color }}>{value}</div>
    </div>
  );
}

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#F9FAFB",
    minHeight: "100%",
  },
  header: {
    marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },
  infoText: { color: "#6B7280" },
  errorBanner: {
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    borderRadius: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  separator: {
    gridColumn: "1 / -1",
    height: "1px",
    backgroundColor: "#E5E7EB",
    margin: "16px 0",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },
  cardValue: {
    fontSize: "36px",
    fontWeight: "800",
  },
};