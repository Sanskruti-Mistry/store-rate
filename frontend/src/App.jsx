// src/App.jsx
import React, { useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MePage from "./pages/MePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStoresPage from "./pages/AdminStoresPage";
import OwnerStorePage from "./pages/OwnerStorePage";
import UserStoresPage from "./pages/UserStoresPage";

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        {/* Logo Section */}
        <Link to="/" style={styles.logoLink}>
          <span style={styles.logoIcon}>⭐</span>
          <span style={styles.logoText}>
            Store<span style={styles.logoHighlight}>Rate</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={styles.nav}>
          <div style={styles.navLinksGroup}>
            <NavLink to="/" style={navLinkStyle}>
              Home
            </NavLink>

            {/* Public Links */}
            {!user && (
              <>
                <NavLink to="/login" style={navLinkStyle}>
                  Login
                </NavLink>
                <NavLink to="/signup" style={navLinkStyle}>
                  Signup
                </NavLink>
              </>
            )}

            {/* Authenticated Links */}
            {user && (
              <>
                <NavLink to="/me" style={navLinkStyle}>
                  Profile
                </NavLink>

                {user.role === "USER" && (
                  <NavLink to="/user/stores" style={navLinkStyle}>
                    Browse Stores
                  </NavLink>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <NavLink to="/admin/dashboard" style={navLinkStyle}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/admin/users" style={navLinkStyle}>
                      Users
                    </NavLink>
                    <NavLink to="/admin/stores" style={navLinkStyle}>
                      Stores
                    </NavLink>
                  </>
                )}

                {user.role === "OWNER" && (
                  <NavLink to="/owner/store" style={navLinkStyle}>
                    My Store
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* User Profile & Logout Section */}
          {user && (
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                <span style={styles.userEmail}>{user.email}</span>
                <span style={roleBadgeStyle(user.role)}>{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                onMouseEnter={() => setIsHoveringLogout(true)}
                onMouseLeave={() => setIsHoveringLogout(false)}
                style={{
                  ...styles.logoutBtn,
                  ...(isHoveringLogout ? styles.logoutBtnHover : {}),
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

// --- Styles ---

const styles = {
  appContainer: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F9FAFB", // Slate-50
  },
  header: {
    backgroundColor: "#ffffff",
    height: "64px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    boxSizing: "border-box",
    borderBottom: "1px solid #E5E7EB", // Slate-200
    position: "sticky",
    top: 0,
    zIndex: 50,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  },
  logoLink: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "24px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827", // Gray-900
    letterSpacing: "-0.5px",
  },
  logoHighlight: {
    color: "#4F46E5", // Indigo-600
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLinksGroup: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingLeft: "24px",
    borderLeft: "1px solid #E5E7EB",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: "1.2",
  },
  userEmail: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151", // Gray-700
  },
  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#ffffff",
    color: "#4B5563",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  logoutBtnHover: {
    backgroundColor: "#FEE2E2", // Red-50
    borderColor: "#FECACA", // Red-200
    color: "#B91C1C", // Red-700
  },
  main: {
    flex: 1,
    width: "100%",
    padding: "0", // Pages handle their own padding now
    boxSizing: "border-box",
    backgroundColor: "#F9FAFB",
  },
};

// Dynamic style for NavLinks
const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#4F46E5" : "#6B7280", // Indigo-600 vs Gray-500
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: isActive ? "600" : "500",
  padding: "8px 0",
  borderBottom: isActive ? "2px solid #4F46E5" : "2px solid transparent",
  transition: "color 0.2s",
});

// Helper for the role badge in the header
const roleBadgeStyle = (role) => ({
  fontSize: "10px",
  fontWeight: "700",
  textTransform: "uppercase",
  color:
    role === "ADMIN"
      ? "#B91C1C" // Red
      : role === "OWNER"
      ? "#4338CA" // Indigo
      : "#059669", // Green
});

function ProtectedRoute({ children, roles }) {
  const { token, user, initializing } = useAuth();

  if (initializing) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        Authenticating...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/stores"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserStoresPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminStoresPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/store"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <OwnerStorePage />
            </ProtectedRoute>
          }
        />

        {/* redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;