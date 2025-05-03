import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";

const CONTRACT_ADDRESS = "0x074dE1686d2D81690FBabdf7F5336e58AC1Cd46c";

export default function ValidateGoalForm() {
  const [account, setAccount] = useState("");
  const [goalData, setGoalData] = useState(null);
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask to continue.");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, provider);

    try {
      const [amount, startTime, stepGoal, validated, withdrawn] = await contract.getGoalStatus(accounts[0]);
      setGoalData({
        amount,
        startTime,
        stepGoal: Number(stepGoal),
        validated,
        withdrawn
      });
    } catch (err) {
      console.error("Goal load error:", err);
      setMessage("No goal found. Did you start a goal?");
    }
  }

  async function checkSteps() {
    if (!goalData) return;

    const accessToken = prompt("Paste your Google Fit Access Token");
    if (!accessToken) return;

    try {
      const res = await fetch("http://localhost:5050/api/validate-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          userAddress: account
        })
      });

      const data = await res.json();
      if (data.steps !== undefined) setSteps(data.steps);

      if (
        data.steps >= goalData.stepGoal &&
        !goalData.validated &&
        !goalData.withdrawn
      ) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);

        await fetch("http://localhost:5050/api/validate-onchain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: account })
        });

        setMessage("✅ Step goal reached. Validation request sent!");
        await connectWallet();  // Refresh status
      } else {
        setMessage(data.message || "Step count checked.");
      }
    } catch (err) {
      console.error("Error checking steps:", err);
      setMessage("Error contacting step validation server.");
    }
  }

  async function withdrawFunds() {
    try {
      setMessage("⏳ Withdraw in progress...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);
      const tx = await contract.withdraw();
      await tx.wait();
      setMessage("✅ Withdraw successful! Check your wallet.");
      await connectWallet(); // Refresh status
    } catch (err) {
      console.error("Withdraw error:", err);
      setMessage("❌ Withdraw failed: " + (err.reason || err.message));
    }
  }
  

  return (
    
    <div style={containerStyle}>
      
      <h2>Validate Your Goal</h2>
      <p><b>Wallet:</b> {account}</p>

      {goalData && (
        <>
          <p><b>Staked:</b> {ethers.formatEther(goalData.amount)} ETH</p>
          <p><b>Step Goal:</b> {goalData.stepGoal}</p>
          <p><b>Start Time:</b> {new Date(Number(goalData.startTime) * 1000).toLocaleString()}</p>
          <p><b>Status:</b> {goalData.validated ? "✅ Validated" : "❌ Not yet validated"}</p>

          {!goalData.validated && (
            <button onClick={checkSteps} style={{ ...btnStyle, background: "#10b981" }}>
              Check Steps with Google Fit
            </button>
          )}

          {steps !== null && (
            <p style={{ marginTop: 12 }}>
              📊 Steps walked: <b>{steps}</b><br />
              {steps >= goalData.stepGoal
                ? "🎉 Goal reached! You can now withdraw."
                : 🚶 You need ${goalData.stepGoal - steps} more steps.}
            </p>
          )}
          
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



          {goalData.withdrawn && (
            <p style={{ ...btnStyle, background: "#6366f1", marginTop: 16 }}>
              Funds have been withdrawn.Check your wallet.
            </p>
          )}
        </>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

// Styling
const navWrapperStyle = {
  width: "100%",
  position: "relative",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#f9fafb"
};

const navbarStyle = {
  width: "100%",
  maxWidth: "1280px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  background: "#ffffff10",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  margin: "1.25rem auto",
  boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
  position: "sticky",
  top: "1rem",
  zIndex: 1000
};

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at top left, #f3e8ff, #e0f2fe)",
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  color: "#111827"
};

const titleStyle = {
  fontSize: "2.3rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const descStyle = {
  fontSize: "1.1rem",
  color: "#4b5563",
  marginBottom: "1.5rem",
  textAlign: "center"
};

const infoCard = {
  background: "#f9fafb",
  padding: "1rem",
  borderRadius: "10px",
  marginBottom: "1rem",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
  fontSize: "0.95rem"
};

const btnStyle = {
  width: "100%",
  marginTop: "1.5rem",
  padding: "1rem",
  fontSize: "1rem",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)"
};
