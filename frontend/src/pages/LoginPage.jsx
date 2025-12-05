// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { setFromAuthResponse } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeHint, setActiveHint] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await loginUser(form);
      setFromAuthResponse(res);
      navigate("/me");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const hintStyle = {
    marginTop: "4px",
    padding: "6px 8px",
    borderRadius: "6px",
    backgroundColor: "#eef2ff",
    color: "#1f2937",
    fontSize: "12px",
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        padding: "40px 16px 24px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* Card  */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "24px 24px 20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: "4px", fontSize: "22px" }}>Login</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* EMAIL */}
          <div
            onMouseEnter={() => setActiveHint("email")}
            onMouseLeave={() => setActiveHint(null)}
          >
            <label style={labelStyle}>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setActiveHint("email")}
                onBlur={() => setActiveHint(null)}
                style={inputStyle}
                required
              />
            </label>
            {activeHint === "email" && (
              <div style={hintStyle}>
                Use the email you registered with Store Rating System.
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div
            onMouseEnter={() => setActiveHint("password")}
            onMouseLeave={() => setActiveHint(null)}
          >
            <label style={labelStyle}>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setActiveHint("password")}
                onBlur={() => setActiveHint(null)}
                style={inputStyle}
                required
              />
            </label>
            {activeHint === "password" && (
              <div style={hintStyle}>Enter your password.</div>
            )}
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: submitting ? "default" : "pointer",
              backgroundColor: submitting ? "#2563eb88" : "#2563eb",
              color: "white",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          <p
            style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}
          >
            New user?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#16a34a", cursor: "pointer", fontWeight: 600 }}
            >
              Signup here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "12px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const inputStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #d4d4d4",
  fontSize: "14px",
};

const errorStyle = {
  padding: "8px 10px",
  borderRadius: "8px",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  fontSize: "13px",
};
