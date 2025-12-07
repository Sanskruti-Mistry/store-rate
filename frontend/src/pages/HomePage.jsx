import React from "react";

export default function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Left Text */}
        <div style={styles.textSection}>
          <div style={styles.badge}>Welcome</div>
          <h1 style={styles.title}>
            Store Rating <span style={styles.highlight}>System</span>
          </h1>
          <p style={styles.subtitle}>
            Discover the best local stores, rate your experiences, and help the
            community grow.
          </p>
          
        </div>

        {/* Right Image */}
        <div style={styles.imageSection}>
          <div style={styles.imageCard}>
            <img
              src="https://i.pinimg.com/736x/0d/45/93/0d4593b03fb102e97f42eddb27fe0b8d.jpg"
              alt="Store illustration"
              style={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F9FAFB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    maxWidth: "1200px",
    width: "100%",
    padding: "40px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "60px",
  },
  textSection: {
    flex: 1,
    minWidth: "300px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1.2",
    marginBottom: "24px",
  },
  highlight: {
    color: "#4F46E5",
  },
  subtitle: {
    fontSize: "18px",
    color: "#6B7280",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
  },
  primaryBtn: {
    padding: "12px 24px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
  },
  secondaryBtn: {
    padding: "12px 24px",
    backgroundColor: "white",
    color: "#374151",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  imageSection: {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
  },
  imageCard: {
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  image: {
    width: "100%",
    maxWidth: "450px",
    borderRadius: "16px",
    display: "block",
  },
};