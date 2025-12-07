// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { signupUser } from "../api/client";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { setFromAuthResponse } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER", // Default value
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
      const res = await signupUser(form);
      setFromAuthResponse(res);
      // Redirect based on role
      if (res.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (res.user.role === "OWNER") navigate("/owner/store");
      else navigate("/me");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join us to start rating stores today.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* NAME */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setActiveHint("name")}
              onBlur={() => setActiveHint(null)}
              style={styles.input}
              required
            />
            {activeHint === "name" && (
              <div style={styles.hint}>Min 20, Max 60 characters.</div>
            )}
          </div>

          {/* EMAIL */}
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
              required
            />
            {activeHint === "email" && (
              <div style={styles.hint}>Must be a valid email address.</div>
            )}
          </div>

          {/* ROLE SELECTOR - NEW ADDITION */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a...</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="USER">Regular User (I want to rate stores)</option>
              <option value="OWNER">Store Owner (I have a shop)</option>
              <option value="ADMIN">Admin (For testing purposes)</option>
            </select>
          </div>

          {/* PASSWORD */}
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
              required
            />
            {activeHint === "password" && (
              <div style={styles.hint}>
                8-16 chars, 1 uppercase, 1 special char.
              </div>
            )}
          </div>

          {/* ADDRESS */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Address (Optional)</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              onFocus={() => setActiveHint("address")}
              onBlur={() => setActiveHint(null)}
              style={styles.textarea}
            />
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
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>

          <div style={styles.footer}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={styles.link}>
              Log in
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
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  header: { marginBottom: "24px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#6B7280" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px", backgroundColor: "white", cursor: "pointer" },
  textarea: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px", minHeight: "80px", resize: "vertical", fontFamily: "inherit" },
  hint: { fontSize: "12px", color: "#4F46E5", backgroundColor: "#EEF2FF", padding: "6px 8px", borderRadius: "4px" },
  button: { marginTop: "12px", padding: "12px", backgroundColor: "#10B981", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600" },
  errorBanner: { padding: "10px", backgroundColor: "#FEE2E2", color: "#991B1B", borderRadius: "6px", fontSize: "13px" },
  footer: { textAlign: "center", fontSize: "14px", color: "#6B7280", marginTop: "12px" },
  link: { color: "#4F46E5", fontWeight: "600", cursor: "pointer" },
};