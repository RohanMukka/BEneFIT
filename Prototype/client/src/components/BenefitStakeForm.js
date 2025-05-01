// BenefitStakeForm.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";

const CONTRACT_ADDRESS = "0x074dE1686d2D81690FBabdf7F5336e58AC1Cd46c";

function getNetworkName(chainId) {
  switch (chainId) {
    case 1: return "Mainnet";
    case 11155111: return "Sepolia";
    case 5: return "Goerli";
    case 137: return "Polygon";
    default: return `Chain ${chainId}`;
  }
}

function getExplorerBase(chainId) {
  switch (chainId) {
    case 1: return "https://etherscan.io/address/";
    case 11155111: return "https://sepolia.etherscan.io/address/";
    case 5: return "https://goerli.etherscan.io/address/";
    case 137: return "https://polygonscan.com/address/";
    default: return null;
  }
}

export default function BenefitStakeForm() {
  const [stepGoal, setStepGoal] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [chainId, setChainId] = useState(null);
  const [txStatus, setTxStatus] = useState("");

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

  async function ensureSepolia() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (Number(net.chainId) !== 11155111) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
        return true;
      } catch {
        alert("Please switch MetaMask to Sepolia Testnet.");
        return false;
      }
    }
    return true;
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const sepoliaOk = await ensureSepolia();
    if (!sepoliaOk) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const bal = await provider.getBalance(accounts[0]);
    const net = await provider.getNetwork();
    setBalance(ethers.formatEther(bal));
    setChainId(Number(net.chainId));
    setNetwork(getNetworkName(Number(net.chainId)));
  }

  async function stakeETH(e) {
    e.preventDefault();
    if (!stepGoal || !stakeAmount) {
      alert("Please fill both fields.");
      return;
    }

    try {
      setTxStatus("⏳ Waiting for transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);

      const existingGoal = await contract.getGoalStatus(await signer.getAddress());
      if (existingGoal[0] > 0n) {
        setTxStatus("⚠️ You already have an active goal.");
        return;
      }

      const tx = await contract.startGoal(
        ethers.toBigInt(stepGoal),
        { value: ethers.parseEther(stakeAmount) }
      );

      await tx.wait();
      const newBal = await provider.getBalance(await signer.getAddress());
      setBalance(ethers.formatEther(newBal));
      setTxStatus("✅ Stake successful! ETH locked.");
    } catch (err) {
      let msg = "❌ Transaction failed.";
      if (err.code === "CALL_EXCEPTION") {
        msg += "\n➡️ Possible reasons:\n• Active goal exists\n• Insufficient ETH sent";
      } else if (err.reason) {
        msg += " " + err.reason;
      } else if (err.message) {
        msg += " " + err.message;
      }
      console.error("Stake Error:", err);
      setTxStatus(msg);
    }
  }

  const explorerBase = getExplorerBase(chainId);
  const explorerUrl = account && explorerBase ? explorerBase + account : "#";

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>🏁 Stake for Your Fitness Goal</h1>
      <p style={descStyle}>Commit ETH toward your step target. Stay fit and earn it back!</p>

      {!account ? (
        <button onClick={connectWallet} style={{ ...btnStyle, background: "#3b82f6" }}>
          🔗 Connect MetaMask
        </button>
      ) : (
        <>
          <div style={infoCard}>
            <p><b>Wallet:</b> {account}</p>
            <p><b>ETH Balance:</b> {balance}</p>
            <p><b>Network:</b> {network}</p>
            <p><b>Explorer:</b> <a href={explorerUrl} target="_blank" rel="noopener noreferrer">{explorerUrl}</a></p>
          </div>

          <form onSubmit={stakeETH}>
            <label style={labelStyle}>Target Step Count</label>
            <input type="number" value={stepGoal} min="1" onChange={e => setStepGoal(e.target.value)} style={inputStyle} placeholder="e.g. 10000" />

            <label style={labelStyle}>ETH to Stake</label>
            <input type="number" value={stakeAmount} min="0.001" step="0.001" onChange={e => setStakeAmount(e.target.value)} style={inputStyle} placeholder="e.g. 0.01" />

            <button type="submit" style={{ ...btnStyle, background: "#10b981" }}>💰 Stake ETH & Start Goal</button>
          </form>
        </>
      )}

      {txStatus && <div style={statusStyle}>{txStatus}</div>}
    </div>
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
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  color: "#111827"
};

const titleStyle = {
  fontSize: "2.3rem",
  fontWeight: "bold",
  color: "#111827",
  marginBottom: "0.5rem",
  textAlign: "center"
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

const labelStyle = {
  fontWeight: "600",
  display: "block",
  marginTop: "1rem",
  marginBottom: "0.5rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem"
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

const statusStyle = {
  marginTop: "1.5rem",
  fontWeight: "500",
  color: "#334155",
  whiteSpace: "pre-wrap",
  textAlign: "center"
};