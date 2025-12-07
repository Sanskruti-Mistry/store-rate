// src/pages/MePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchCurrentUser } from "../api/client";

export default function MePage() {
  const { token, user: authUser, setFromAuthResponse } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCurrentUser(token);
        const serverUser = res?.user || res;
        setProfile(serverUser);
        if (serverUser && authUser && serverUser.id === authUser.id) {
          setFromAuthResponse({ token, user: serverUser });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch current user");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (error) return <div style={styles.errorContainer}>{error}</div>;

  const u = profile || authUser;

  if (!u) {
    return <div style={styles.loading}>No user info available.</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.profileCard}>
        <div style={styles.header}>
          <div style={styles.avatarPlaceholder}>{u.name.charAt(0)}</div>
          <h2 style={styles.name}>{u.name}</h2>
          <span style={styles.roleBadge}>{u.role}</span>
        </div>

        <div style={styles.infoGrid}>
          <ProfileField label="User ID" value={`#${u.id}`} />
          <ProfileField label="Email" value={u.email} />
          <ProfileField label="Address" value={u.address || "Not provided"} />
          <ProfileField
            label="Joined"
            value={u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={styles.fieldItem}>
      <div style={styles.fieldLabel}>{label}</div>
      <div style={styles.fieldValue}>{value}</div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#F9FAFB",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#6B7280",
  },
  errorContainer: {
    margin: "20px",
    padding: "16px",
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    borderRadius: "8px",
    maxWidth: "600px",
  },
  profileCard: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#F3F4F6",
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid #E5E7EB",
  },
  avatarPlaceholder: {
    width: "80px",
    height: "80px",
    backgroundColor: "#4F46E5",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  name: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  roleBadge: {
    backgroundColor: "#E0E7FF",
    color: "#4338CA",
    padding: "4px 12px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoGrid: {
    padding: "24px",
    display: "grid",
    gap: "20px",
  },
  fieldItem: {
    borderBottom: "1px solid #F3F4F6",
    paddingBottom: "12px",
  },
  fieldLabel: {
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  fieldValue: {
    fontSize: "16px",
    color: "#374151",
    fontWeight: "500",
  },
};