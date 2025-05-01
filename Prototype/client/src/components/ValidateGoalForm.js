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

      // Automatically validate if goal is met and not already validated
      if (
        data.steps >= goalData.stepGoal &&
        !goalData.validated &&
        !goalData.withdrawn
      ) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);
        // Ask backend (oracle/owner) to validate on-chain
await fetch("http://localhost:5050/api/validate-onchain", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userAddress: account })
});

setMessage("✅ Step goal reached. Validation request sent!");
await connectWallet();  // Refresh status

        setMessage("✅ Step goal reached and validated!");
        await connectWallet(); // Refresh goalData
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);
      const tx = await contract.withdraw();
      await tx.wait();
      setMessage("✅ Withdraw successful! Check your wallet.");
      await connectWallet(); // Refresh status after withdrawal
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
                : `🚶 You need ${goalData.stepGoal - steps} more steps.`}
            </p>
          )}

          {goalData.validated && !goalData.withdrawn && steps !== null && steps >= goalData.stepGoal && (
            <button onClick={withdrawFunds} style={{ ...btnStyle, background: "#6366f1", marginTop: 16 }}>
              💸 Withdraw Staked ETH
            </button>
          )}
        </>
      )}

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

// Styling
const containerStyle = {
  maxWidth: 440,
  margin: "100px auto",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 2px 12px #0001",
  background: "#fff"
};

const btnStyle = {
  marginTop: 18,
  width: "100%",
  padding: 12,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};
