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
        // Support both { user: {...} } and plain {...}
        const serverUser = res?.user || res;

        setProfile(serverUser);

        // keep AuthContext in sync with latest data
        if (serverUser && authUser && serverUser.id === authUser.id) {
          setFromAuthResponse({ token, user: serverUser });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch current user from server");
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return <p style={{ padding: "16px" }}>Loading profile...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
        }}
      >
        <div style={errorStyle}>{error}</div>
      </div>
    );
  }

  const u = profile || authUser;

  if (!u) {
    return (
      <div style={{ padding: "16px" }}>
        <p>No user information available.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 16px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "28px 24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          My Profile
        </h2>

        <ProfileField label="User ID" value={u.id} />
        {u.name && <ProfileField label="Name" value={u.name} />}
        <ProfileField label="Email" value={u.email} />
        <ProfileField label="Role" value={u.role} />
        {u.address && <ProfileField label="Address" value={u.address} />}
        {"createdAt" in u && (
          <ProfileField
            label="Account Created"
            value={new Date(u.createdAt).toLocaleString()}
          />
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: "10px 12px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          fontSize: "15px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const errorStyle = {
  marginBottom: "16px",
  padding: "8px 12px",
  borderRadius: "8px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "14px",
};
