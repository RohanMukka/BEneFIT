import React from "react";

export default function ChoicePage({ onSelect }) {
  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>BEneFIT Fitness Challenge</h2>
      <p>What would you like to do?</p>
      <button onClick={() => onSelect("start")} style={btnStyle}>Start New Goal</button>
      <button onClick={() => onSelect("validate")} style={btnStyle}>Validate Existing Goal</button>
    </div>
  );
}

const btnStyle = {
  margin: 10,
  padding: 12,
  fontSize: 16,
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};
