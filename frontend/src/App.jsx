// src/App.jsx
import React from "react";
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <header
        style={{
          backgroundColor: "#111827",
          color: "white",
          height: "60px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Store Rating System
        </Link>

        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <NavLink to="/" style={({ isActive }) => navLinkStyle(isActive)}>
            Home
          </NavLink>
          {!user && (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Signup
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink
                to="/me"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Me
              </NavLink>

              {user.role === "USER" && (
                <NavLink
                  to="/user/stores"
                  style={({ isActive }) => navLinkStyle(isActive)}
                >
                  Stores
                </NavLink>
              )}

              {user.role === "ADMIN" && (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    style={({ isActive }) => navLinkStyle(isActive)}
                  >
                    Admin Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/users"
                    style={({ isActive }) => navLinkStyle(isActive)}
                  >
                    Users
                  </NavLink>
                  <NavLink
                    to="/admin/stores"
                    style={({ isActive }) => navLinkStyle(isActive)}
                  >
                    Stores
                  </NavLink>
                </>
              )}

              {user.role === "OWNER" && (
                <NavLink
                  to="/owner/store"
                  style={({ isActive }) => navLinkStyle(isActive)}
                >
                  My Store
                </NavLink>
              )}

              <span style={{ fontSize: "13px" }}>
                {user.email} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: "1px solid #f97316",
                  backgroundColor: "#f97316",
                  color: "white",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
      <main
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          padding: "16px",
          display: "flex",
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const navLinkStyle = (isActive) => ({
  color: isActive ? "#f97316" : "#e5e7eb",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
});

function ProtectedRoute({ children, roles }) {
  const { token, user, initializing } = useAuth();

  if (initializing) {
    return <p>Checking authentication...</p>;
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
