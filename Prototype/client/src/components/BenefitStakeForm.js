// Importing required dependencies and assets
import "../App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaEthereum, FaBullseye, FaLock } from "react-icons/fa";
require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

// Utility function to get the network name based on chain ID
function getNetworkName(chainId) {
  switch (chainId) {
    case 1:
      return "Mainnet";
    case 11155111:
      return "Sepolia";
    case 5:
      return "Goerli";
    case 137:
      return "Polygon";
    default:
      return `Chain ${chainId}`;
  }
}

// Utility function to get the blockchain explorer base URL based on chain ID
function getExplorerBase(chainId) {
  switch (chainId) {
    case 1:
      return "https://etherscan.io/address/";
    case 11155111:
      return "https://sepolia.etherscan.io/address/";
    case 5:
      return "https://goerli.etherscan.io/address/";
    case 137:
      return "https://polygonscan.com/address/";
    default:
      return null;
  }
}

// Main component for the Benefit Stake Form
export default function BenefitStakeForm() {
  // State variables for user input and blockchain data
  const [stepGoal, setStepGoal] = useState(""); // User's step goal
  const [stakeAmount, setStakeAmount] = useState(""); // Amount of ETH to stake
  const [account, setAccount] = useState(""); // User's wallet address
  const [balance, setBalance] = useState(""); // User's wallet balance
  const [network, setNetwork] = useState(""); // Current blockchain network
  const [chainId, setChainId] = useState(null); // Current chain ID

  // Effect to handle wallet events (chain/account changes)
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = () => connectWallet();
    const handleAccountsChanged = () => connectWallet();

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // Function to ensure the user is connected to the Sepolia testnet
  async function ensureSepolia() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (Number(net.chainId) !== 11155111) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
        });
        return true;
      } catch {
        alert("Please switch MetaMask to Sepolia Testnet.");
        return false;
      }
    }
    return true;
  }

  // Function to connect the user's wallet and fetch account details
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const sepoliaOk = await ensureSepolia();
    if (!sepoliaOk) return;

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const bal = await provider.getBalance(accounts[0]);
    const net = await provider.getNetwork();

    setBalance(ethers.formatEther(bal)); // Convert balance to ETH
    setChainId(Number(net.chainId));
    setNetwork(getNetworkName(Number(net.chainId)));
  }

  // Function to handle staking ETH and starting a fitness goal
  async function stakeETH(e) {
    e.preventDefault();

    if (!stepGoal || !stakeAmount) {
      toast.error("Please fill both fields.");
      return;
    }

    try {
      toast.loading("Waiting for transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        BenefitABI.abi,
        signer
      );

      // Check if the user already has an active goal
      const existingGoal = await contract.getGoalStatus(
        await signer.getAddress()
      );
      if (existingGoal[0] > 0n) {
        toast.dismiss();
        toast.error("You already have an active goal.");
        return;
      }

      // Start a new goal with the specified step count and stake amount
      const tx = await contract.startGoal(ethers.toBigInt(stepGoal), {
        value: ethers.parseEther(stakeAmount),
      });

      await tx.wait(); // Wait for the transaction to be mined
      const newBal = await provider.getBalance(await signer.getAddress());
      setBalance(ethers.formatEther(newBal)); // Update balance
      toast.dismiss();
      toast.success("Stake successful! ETH locked.");
    } catch (err) {
      toast.dismiss();
      console.error("Stake Error:", err);
      toast.error(err.reason || err.message || "Transaction failed.");
    }
  }

  // Generate the blockchain explorer URL for the user's account
  const explorerBase = getExplorerBase(chainId);
  const explorerUrl = account && explorerBase ? explorerBase + account : "#";

  return (
    <div style={navWrapperStyle}>
      {/* Navigation bar */}
      <nav style={navbarStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#111827",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          BEneFIT
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="/" className="nav-link">
            🏠 Home
          </a>
          <a href="/stake" className="nav-link">
            💰 Stake
          </a>
          <a href="/validate" className="nav-link">
            ✅ Validate
          </a>
        </div>
      </nav>

      {/* Main content */}
      <motion.div
        style={containerStyle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Toaster position="top-center" />
        <h1 style={titleStyle}>
          <FaBullseye style={{ marginRight: 10 }} />
          Stake for Your Fitness Goal
        </h1>
        <p style={descStyle}>
          Commit ETH toward your step target. Stay fit and earn it back!
        </p>

        {/* Wallet connection and staking form */}
        {!account ? (
          <button
            onClick={connectWallet}
            style={{ ...btnStyle, background: "#3b82f6" }}
          >
            🔗 Connect MetaMask
          </button>
        ) : (
          <>
            {/* Display wallet details */}
            <div
              style={{
                marginBottom: "2rem",
                fontSize: "1rem",
                lineHeight: "1.75",
              }}
            >
              <p>
                <FaEthereum /> <b>Address:</b> {account}
              </p>
              <p>
                <b>Balance:</b> {balance} ETH
              </p>
              <p>
                <b>Network:</b> {network}
              </p>
              <p>
                <b>Explorer:</b>{" "}
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                  {explorerUrl}
                </a>
              </p>
            </div>

            {/* Input fields for step goal and stake amount */}
            <label style={labelStyle}>Target Step Count</label>
            <input
              type="number"
              value={stepGoal}
              min="1"
              onChange={(e) => setStepGoal(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 10000"
            />

            <label style={labelStyle}>ETH to Stake</label>
            <input
              type="number"
              value={stakeAmount}
              min="0.001"
              step="0.001"
              onChange={(e) => setStakeAmount(e.target.value)}
              style={inputStyle}
              placeholder="e.g. 0.01"
            />

            {/* Button to stake ETH */}
            <button
              onClick={stakeETH}
              style={{ ...btnStyle, background: "#10b981" }}
            >
              <FaLock style={{ marginRight: 8 }} /> Stake ETH & Start Goal
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

// --- Styling ---
// Styles for various components of the UI
const navWrapperStyle = {
  width: "100%",
  position: "relative",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#f9fafb",
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
  zIndex: 1000,
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
  color: "#111827",
};

const titleStyle = {
  fontSize: "2.3rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const descStyle = {
  fontSize: "1.1rem",
  color: "#4b5563",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const labelStyle = {
  fontWeight: "600",
  display: "block",
  marginTop: "1rem",
  marginBottom: "0.5rem",
};

const inputStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const btnStyle = {
  width: "100%",
  maxWidth: "400px",
  marginTop: "1.5rem",
  padding: "1rem",
  fontSize: "1rem",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
};
