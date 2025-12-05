// src/pages/HomePage.jsx
import React from "react";

export default function HomePage() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "700",
        }}
      >
        Welcome to Store Rating System
      </h1>
    </div>
  );
}
