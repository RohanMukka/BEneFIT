// ChoicePage.js (with animation and icons)
import '../App.css';
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWalking, FaRocket } from "react-icons/fa";
require("dotenv").config();

export default function ChoicePage() {
  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 style={titleStyle}><FaRocket style={{ marginRight: 10 }} />BEneFIT Fitness Challenge</h1>
      <p style={descStyle}>Unlock your fitness potential with crypto-backed motivation.</p>

      <div style={buttonGroupStyle}>
        <Link to="/stake" style={linkStyle}>
          <button style={{ ...btnStyle, background: "#10b981" }}>
            💪 Start New Goal
          </button>
        </Link>

        <Link to="/validate" style={linkStyle}>
          <button style={{ ...btnStyle, background: "#6366f1" }}>
            ✅ Validate Existing Goal
          </button>
        </Link>
      </div>

      <footer style={footerStyle}>
        Built with ❤️ for your health. Powered by Ethereum.
      </footer>
    </motion.div>
  );
}

// --- Styling ---
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  color: "#111827",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const descStyle = {
  fontSize: "1.2rem",
  marginBottom: "2rem",
  color: "#4b5563",
  textAlign: "center"
};

const buttonGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  maxWidth: "300px"
};

const btnStyle = {
  width: "100%",
  padding: "1rem",
  fontSize: "1rem",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer"
};

const linkStyle = {
  textDecoration: "none"
};

const footerStyle = {
  marginTop: "3rem",
  fontSize: "0.9rem",
  color: "#6b7280"
};
