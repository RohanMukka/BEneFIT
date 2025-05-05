// Importing required dependencies and assets
import "../App.css"; // Importing global CSS styles
import React from "react"; // Importing React for component creation
import { Link } from "react-router-dom"; // Importing Link for navigation between routes
import { motion } from "framer-motion"; // Importing motion for animations
import { FaWalking, FaRocket } from "react-icons/fa"; // Importing icons for UI enhancement

// Main component for the Choice Page
export default function ChoicePage() {
  return (
    <motion.div
      style={containerStyle} // Applying container styles
      initial={{ opacity: 0, y: 30 }} // Initial animation state (faded and shifted down)
      animate={{ opacity: 1, y: 0 }} // Final animation state (fully visible and in position)
      transition={{ duration: 0.6 }} // Duration of the animation
    >
      {/* Page title with an icon */}
      <h1 style={titleStyle}>
        <FaRocket style={{ marginRight: 10 }} />
        BEneFIT Fitness Challenge
      </h1>

      {/* Page description */}
      <p style={descStyle}>
        Unlock your fitness potential with crypto-backed motivation.
      </p>

      {/* Button group for navigation */}
      <div style={buttonGroupStyle}>
        {/* Link to the Stake page */}
        <Link to="/stake" style={linkStyle}>
          <button style={{ ...btnStyle, background: "#10b981" }}>
            💪 Start New Goal
          </button>
        </Link>

        {/* Link to the Validate page */}
        <Link to="/validate" style={linkStyle}>
          <button style={{ ...btnStyle, background: "#6366f1" }}>
            ✅ Validate Existing Goal
          </button>
        </Link>
      </div>

      {/* Footer section */}
      <footer style={footerStyle}>
        Built with ❤️ for your health. Powered by Ethereum.
      </footer>
    </motion.div>
  );
}

// --- Styling ---
// Styles for the container (main layout of the page)
const containerStyle = {
  minHeight: "100vh", // Full viewport height
  display: "flex", // Flexbox layout
  flexDirection: "column", // Stack children vertically
  justifyContent: "center", // Center children vertically
  alignItems: "center", // Center children horizontally
  background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", // Gradient background
  padding: "2rem", // Padding around the content
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Font family for text
};

// Styles for the title (page heading)
const titleStyle = {
  fontSize: "2.5rem", // Large font size
  fontWeight: "bold", // Bold text
  marginBottom: "0.5rem", // Space below the title
  color: "#111827", // Dark text color
  display: "flex", // Flexbox layout
  alignItems: "center", // Center icon vertically with text
  justifyContent: "center", // Center title horizontally
};

// Styles for the description (subheading)
const descStyle = {
  fontSize: "1.2rem", // Medium font size
  marginBottom: "2rem", // Space below the description
  color: "#4b5563", // Gray text color
  textAlign: "center", // Center-align the text
};

// Styles for the button group (container for buttons)
const buttonGroupStyle = {
  display: "flex", // Flexbox layout
  flexDirection: "column", // Stack buttons vertically
  gap: "1rem", // Space between buttons
  width: "100%", // Full width
  maxWidth: "300px", // Maximum width for the button group
};

// Styles for the buttons
const btnStyle = {
  width: "100%", // Full width of the parent container
  padding: "1rem", // Padding inside the button
  fontSize: "1rem", // Medium font size
  color: "#fff", // White text color
  border: "none", // No border
  borderRadius: "10px", // Rounded corners
  fontWeight: "600", // Bold text
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)", // Subtle shadow for depth
  transition: "transform 0.2s ease-in-out", // Smooth scaling effect on hover
  cursor: "pointer", // Pointer cursor on hover
};

// Styles for the links (wrapping buttons)
const linkStyle = {
  textDecoration: "none", // Remove underline from links
};

// Styles for the footer (bottom section of the page)
const footerStyle = {
  marginTop: "3rem", // Space above the footer
  fontSize: "0.9rem", // Small font size
  color: "#6b7280", // Gray text color
};
