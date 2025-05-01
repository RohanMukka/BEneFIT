// BenefitStakeForm.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";
import styles from "./BenefitStakeForm.module.css";

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>🔥 BEneFIT Challenge: Lock ETH for Your Goal</h2>

        {!account ? (
          <button onClick={connectWallet} className={styles.connectBtn}>
            🔗 Connect Wallet
          </button>
        ) : (
          <>
            <div className={styles.accountCard}>
              <div><strong>Address:</strong> {account}</div>
              <div><strong>Balance:</strong> {balance} ETH</div>
              <div><strong>Network:</strong> {network}</div>
              <div><strong>Explorer:</strong> <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa", wordBreak: "break-all", display: "inline-block", overflowWrap: "anywhere" }}>{explorerUrl}</a></div>
            </div>

            <form onSubmit={stakeETH}>
              <label className={styles.label}>🎯 Step Goal</label>
              <input type="number" value={stepGoal} min="1"
                onChange={e => setStepGoal(e.target.value)} placeholder="e.g. 10000" className={styles.input} />

              <label className={styles.label}>💎 ETH to Stake</label>
              <input type="number" value={stakeAmount} min="0.001" step="0.001"
                onChange={e => setStakeAmount(e.target.value)} placeholder="e.g. 0.01" className={styles.input} />

              <button type="submit" className={styles.stakeBtn}>
                🚀 Stake & Launch
              </button>
            </form>
          </>
        )}

        {txStatus && (
          <div className={styles.txStatus}>{txStatus}</div>
        )}
      </div>
    </div>
  );
}