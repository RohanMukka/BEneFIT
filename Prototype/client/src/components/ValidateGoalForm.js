// ValidateGoalForm.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = "http://localhost:5050/oauth-callback";

export default function ValidateGoalForm() {
  // State variables for managing user data and UI state
  const [account, setAccount] = useState(""); // User's wallet address
  const [goalData, setGoalData] = useState(null); // Data about the user's fitness goal
  const [message, setMessage] = useState(""); // Status or error messages
  const [steps, setSteps] = useState(null); // Number of steps fetched from Google Fit
  const [googleConnected, setGoogleConnected] = useState(false); // Whether Google Fit is connected
  const [validating, setValidating] = useState(false); // Whether the validation process is ongoing

  // Effect to connect the wallet and check for Google Fit connection
  useEffect(() => {
    connectWallet().then(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const returnedUser = urlParams.get("user");
      if (returnedUser && returnedUser.toLowerCase() === account.toLowerCase()) {
        setGoogleConnected(true); // Mark Google Fit as connected
        setMessage("🔄 Google Fit connected. Fetching steps...");
        checkSteps(); // Fetch steps from Google Fit
        window.history.replaceState({}, document.title, "/validate"); // Clean up the URL
      }
    });
  }, [account]);

  // Function to connect the user's wallet and fetch goal data
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask to continue."); // Prompt user to install MetaMask
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]); // Set the user's wallet address

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, provider);

    try {
      // Fetch the user's goal data from the smart contract
      const [amount, startTime, stepGoal, validated, withdrawn] = await contract.getGoalStatus(accounts[0]);
      setGoalData({ amount, startTime, stepGoal: Number(stepGoal), validated, withdrawn });
    } catch (err) {
      console.error("Goal load error:", err);
      setMessage("No goal found. Did you start a goal?"); // Display error if no goal is found
    }
  }

  // Function to redirect the user to Google OAuth for connecting Google Fit
  function redirectToGoogleOAuth() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/fitness.activity.read&access_type=offline&prompt=consent&state=${account}`;
    window.location.href = authUrl; // Redirect to Google OAuth
  }

  // Function to validate the user's step goal
  async function checkSteps() {
    try {
      setValidating(true); // Mark validation as ongoing
      setMessage("⏳ Validating step goal...");

      // Send a request to the backend to validate steps
      const res = await fetch("http://localhost:5050/api/validate-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: account })
      });

      const data = await res.json();
      if (data.steps !== undefined) setSteps(data.steps); // Update the steps state

      // Check if the step goal is met and validate on-chain if necessary
      if (data.steps >= goalData.stepGoal && !goalData.validated && !goalData.withdrawn) {
        await fetch("http://localhost:5050/api/validate-onchain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: account })
        });

        setMessage("✅ Step goal reached. Validation request sent!");
        await connectWallet(); // Refresh goal data
      } else {
        setMessage(data.message || `🚶 You need ${goalData.stepGoal - data.steps} more steps.`);
      }
    } catch (err) {
      console.error("Error checking steps:", err);
      setMessage("Error contacting step validation server."); // Display error message
    } finally {
      setValidating(false); // Mark validation as complete
    }
  }

  // Function to withdraw staked funds after goal validation
  async function withdrawFunds() {
    try {
      setMessage("⏳ Withdraw in progress...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);
      const tx = await contract.withdraw(); // Call the withdraw function on the smart contract
      await tx.wait(); // Wait for the transaction to be mined
      setMessage("✅ Withdraw successful! Check your wallet.");
      await connectWallet(); // Refresh goal data
    } catch (err) {
      console.error("Withdraw error:", err);
      setMessage("❌ Withdraw failed: " + (err.reason || err.message)); // Display error message
    }
  }

  // Render the UI
  return (
    <div style={containerStyle}>
      <h2>Validate Your Goal</h2>
      <p><b>Wallet:</b> {account}</p>

      {goalData && (
        <>
          {/* Display goal details */}
          <p><b>Staked:</b> {ethers.formatEther(goalData.amount)} ETH</p>
          <p><b>Step Goal:</b> {goalData.stepGoal}</p>
          <p><b>Start Time:</b> {new Date(Number(goalData.startTime) * 1000).toLocaleString()}</p>
          <p><b>Status:</b> {goalData.validated ? "✅ Validated" : "❌ Not yet validated"}</p>

          {/* Button to connect Google Fit */}
          {!goalData.validated && !googleConnected && (
            <button onClick={redirectToGoogleOAuth} style={{ ...btnStyle, background: "#10b981" }}>
              Connect Google Fit
            </button>
          )}

          {/* Button to check steps */}
          {!goalData.validated && googleConnected && (
            <button onClick={checkSteps} style={{ ...btnStyle, background: "#0ea5e9" }} disabled={validating}>
              {validating ? "⏳ Validating..." : "Check Steps"}
            </button>
          )}

          {/* Display steps walked */}
          {steps !== null && (
            <p style={{ marginTop: 12 }}>
              📊 Steps walked: <b>{steps}</b><br />
              {steps >= goalData.stepGoal
                ? "🎉 Goal reached! You can now withdraw."
                : `🚶 You need ${goalData.stepGoal - steps} more steps.`}
            </p>
          )}

          {/* Button to withdraw funds */}
          {goalData.validated && !goalData.withdrawn && (
            <button
              onClick={withdrawFunds}
              disabled={message === "⏳ Withdraw in progress..."}
              style={{
                ...btnStyle,
                background: "#6366f1",
                marginTop: 16,
                opacity: message === "⏳ Withdraw in progress..." ? 0.7 : 1,
                cursor: message === "⏳ Withdraw in progress..." ? "not-allowed" : "pointer"
              }}
            >
              {message === "✅ Withdraw successful! Check your wallet."
                ? "✅ Withdraw Successful"
                : message === "⏳ Withdraw in progress..."
                  ? "⏳ Withdraw in Progress..."
                  : "💸 Withdraw Staked ETH"}
            </button>
          )}

          {/* Message if funds are already withdrawn */}
          {goalData.withdrawn && (
            <p style={{ ...btnStyle, background: "#6366f1", marginTop: 16 }}>
              Funds have been withdrawn. Check your wallet.
            </p>
          )}
        </>
      )}

      {/* Display status or error messages */}
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
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
  background: "radial-gradient(circle at top left, #f3e8ff, #e0f2fe)", // Gradient background
  padding: "2rem", // Padding around the content
  fontFamily: "'Segoe UI', Tahoma, sans-serif", // Font family for text
  color: "#111827" // Dark text color
};

// Styles for the buttons
const btnStyle = {
  width: "100%", // Full width of the parent container
  marginTop: "1.5rem", // Space above the button
  padding: "1rem", // Padding inside the button
  fontSize: "1rem", // Medium font size
  color: "#fff", // White text color
  border: "none", // No border
  borderRadius: "10px", // Rounded corners
  fontWeight: "600", // Bold text
  cursor: "pointer", // Pointer cursor on hover
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)" // Subtle shadow for depth
};