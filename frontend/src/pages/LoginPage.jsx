// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { setFromAuthResponse } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setActiveHint("email")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              placeholder="name@company.com"
              required
            />
            {activeHint === "email" && (
              <div style={styles.hint}>
                Use the email you registered with.
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setActiveHint("password")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
            {activeHint === "password" && (
              <div style={styles.hint}>Enter your password.</div>
            )}
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <div style={styles.footer}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} style={styles.link}>
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  header: {
    marginBottom: "24px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6B7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #D1D5DB",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  hint: {
    fontSize: "12px",
    color: "#6B7280",
    backgroundColor: "#F9FAFB",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #E5E7EB",
  },
  button: {
    marginTop: "8px",
    padding: "10px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "opacity 0.2s",
  },
  errorBanner: {
    padding: "10px",
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    borderRadius: "6px",
    fontSize: "13px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6B7280",
    marginTop: "16px",
  },
  link: {
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
  },
};