// ValidateGoalForm.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";
import styles from "./ValidateGoalForm.module.css";

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
        body: JSON.stringify({ accessToken, userAddress: account })
      });

      const data = await res.json();
      if (data.steps !== undefined) setSteps(data.steps);

      if (data.steps >= goalData.stepGoal && !goalData.validated && !goalData.withdrawn) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);

        await fetch("http://localhost:5050/api/validate-onchain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: account })
        });

        setMessage("✅ Step goal reached. Validation request sent!");
        await connectWallet();
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
      await connectWallet();
    } catch (err) {
      console.error("Withdraw error:", err);
      setMessage("❌ Withdraw failed: " + (err.reason || err.message));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>🧠 Validate Your Goal</h2>
        <p><strong>Wallet:</strong> {account}</p>

        {goalData && (
          <>
            <p><strong>Staked:</strong> {ethers.formatEther(goalData.amount)} ETH</p>
            <p><strong>Step Goal:</strong> {goalData.stepGoal}</p>
            <p><strong>Start Time:</strong> {new Date(Number(goalData.startTime) * 1000).toLocaleString()}</p>
            <p><strong>Status:</strong> {goalData.validated ? "✅ Validated" : "❌ Not yet validated"}</p>

            {!goalData.validated && (
              <button onClick={checkSteps} className={styles.checkBtn}>
                🔍 Check Steps with Google Fit
              </button>
            )}

            {steps !== null && (
              <p className={styles.feedback}>
                📊 Steps walked: <strong>{steps}</strong><br />
                {steps >= goalData.stepGoal
                  ? "🎉 Goal reached! You can now withdraw."
                  : `🚶 You need ${goalData.stepGoal - steps} more steps.`}
              </p>
            )}

            {goalData.validated && !goalData.withdrawn && steps !== null && steps >= goalData.stepGoal && (
              <button onClick={withdrawFunds} className={styles.withdrawBtn}>
                💸 Withdraw Staked ETH
              </button>
            )}
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}