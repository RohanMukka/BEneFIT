import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BenefitABI from "../abi/BenefitLockAndReleaseNoDeadline.json";

const CONTRACT_ADDRESS = "0x399F854AAA0424CB360853cbf4a80b66c8cE2960";

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
    const handleChainChanged = () => {
      connectWallet();
    };
    const handleAccountsChanged = () => {
      connectWallet();
    };
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
    // eslint-disable-next-line
  }, []);

  async function ensureSepolia() {
    if (!window.ethereum) return false;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (Number(net.chainId) !== 11155111) {
      try {
        // Ask MetaMask to switch to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Hex for 11155111
        });
        return true;
      } catch (switchError) {
        alert("Please switch MetaMask to Sepolia Testnet and connect again.");
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
    setBalance(ethers.formatEther(bal));
    const net = await provider.getNetwork();
    setChainId(Number(net.chainId));
    setNetwork(getNetworkName(Number(net.chainId)));
    // Debugging logs
    console.log("Selected Account:", accounts[0]);
    console.log("Network:", net.name, net.chainId);
    console.log("Balance (ETH):", ethers.formatEther(bal));
  }

  async function stakeETH(e) {
    e.preventDefault();
    if (!stepGoal || !stakeAmount) {
      alert("Please fill both fields.");
      return;
    }
    try {
      setTxStatus("Waiting for transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BenefitABI.abi, signer);

      const tx = await contract.startGoal({ value: ethers.parseEther(stakeAmount) });
      await tx.wait();

      // Update balance after successful transaction
      const userAddress = await signer.getAddress();
      const newBal = await provider.getBalance(userAddress);
      setBalance(ethers.formatEther(newBal));

      setTxStatus("Stake successful! ETH locked until your goal is validated.");
    } catch (err) {
      let msg = "Transaction failed.";
      if (err.reason) msg += " " + err.reason;
      else if (err.message) msg += " " + err.message;
      setTxStatus(msg);
      console.error(err);
    }
  }

  const explorerBase = getExplorerBase(chainId);
  const explorerUrl = account && explorerBase ? explorerBase + account : "#";

  return (
    <div style={{
      maxWidth: 440, margin: "100px auto", padding: 24, borderRadius: 16,
      boxShadow: "0 2px 12px #0001", background: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>BEneFIT: Stake For Your Fitness Goal</h2>
      {!account ? (
        <button onClick={connectWallet}
                style={{ width: "100%", padding: 12, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8 }}>
          Connect MetaMask
        </button>
      ) : (
        <>
          {/* ACCOUNT INFO CARD */}
          <div style={{
            background: "#f9fafb",
            borderRadius: 12,
            padding: 16,
            marginBottom: 18,
            fontSize: 13,
            boxShadow: "0 1px 4px #0001",
          }}>
            <strong>Account Details</strong>
            <div><b>Address:</b> {account}</div>
            <div><b>ETH Balance:</b> {balance || "0"} ETH</div>
            <div><b>Network:</b> {network || "Unknown"}</div>
            <div>
              <b>Explorer:</b>{" "}
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", wordBreak: "break-all" }}
              >
                {explorerUrl}
              </a>
            </div>
          </div>
          {/* END ACCOUNT INFO CARD */}

          <form onSubmit={stakeETH}>
            <label style={{ display: "block", margin: "12px 0 4px" }}>Target Step Count</label>
            <input
              type="number"
              min="1"
              value={stepGoal}
              onChange={e => setStepGoal(e.target.value)}
              placeholder="e.g. 10000"
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <label style={{ display: "block", margin: "12px 0 4px" }}>ETH to Stake</label>
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={stakeAmount}
              onChange={e => setStakeAmount(e.target.value)}
              placeholder="e.g. 0.01"
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <button
              type="submit"
              style={{ marginTop: 18, width: "100%", padding: 12, background: "#10b981", color: "#fff", border: "none", borderRadius: 8 }}>
              Stake ETH & Start Goal
            </button>
          </form>
        </>
      )}
      {txStatus && <div style={{ marginTop: 18, color: "#334155", fontWeight: "bold" }}>{txStatus}</div>}
    </div>
  );
}
