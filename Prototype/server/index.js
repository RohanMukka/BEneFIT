const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Smart contract config
const CONTRACT_ADDRESS = "0x074dE1686d2D81690FBabdf7F5336e58AC1Cd46c";
const ABI = require("../client/src/abi/BenefitLockAndReleaseNoDeadline.json").abi;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://sepolia.infura.io/v3/834123c9cebf4ca197b5904ab5caec91");
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

// ✅ Validate steps with Google Fit
app.post("/api/validate-steps", async (req, res) => {
  try {
    const { accessToken, userAddress } = req.body;
    if (!accessToken || !userAddress) {
      return res.status(400).json({ error: "Missing accessToken or userAddress" });
    }

    console.log("🔍 Validating steps for:", userAddress);

    const goal = await contract.getGoalStatus(userAddress);
    const startTimeMillis = Number(goal[1]) * 1000;
    const stepGoal = Number(goal[2]);

    if (stepGoal === 0) {
      return res.status(404).json({
        success: false,
        steps: 0,
        message: "⚠️ No step goal found for this user."
      });
    }

    const endTimeMillis = Date.now();
    const url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
    const data = {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
      startTimeMillis,
      endTimeMillis
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    let totalSteps = 0;
    const buckets = response.data.bucket;
    if (buckets?.length > 0) {
      for (const bucket of buckets) {
        const dataset = bucket.dataset[0];
        if (dataset?.point?.length > 0) {
          for (const point of dataset.point) {
            totalSteps += point.value[0].intVal || 0;
          }
        }
      }
    }

    // Response based on steps walked
    if (totalSteps >= stepGoal) {
      return res.json({
        success: true,
        steps: totalSteps,
        message: `✅ Hurray! You've walked ${totalSteps} steps. Goal reached!`
      });
    } else {
      return res.json({
        success: false,
        steps: totalSteps,
        message: `❌ Goal not reached. You still need ${stepGoal - totalSteps} steps.`
      });
    }
  } catch (err) {
    console.error("❌ Google Fit API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to validate steps from Google Fit" });
  }
});

// ✅ On-chain goal validation — called by backend owner/oracle
app.post("/api/validate-onchain", async (req, res) => {
  const { userAddress } = req.body;

  if (!userAddress) {
    return res.status(400).json({ message: "Missing userAddress" });
  }

  try {
    const signer = new ethers.Wallet('839673eeed81fcce11b6e5ad467accde99582ea941d5eb64a610610ae40fc49a', provider);
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const tx = await contractWithSigner.validateGoal(userAddress);
    await tx.wait();

    console.log(`✅ Goal validated on-chain for ${userAddress}`);
    res.status(200).json({ message: "✅ Goal validated on-chain!" });
  } catch (err) {
    console.error("❌ On-chain validation error:", err);
    res.status(500).json({ message: "❌ Failed to validate on-chain", error: err.message });
  }
});

// Server listen
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});

// Optional: catch unexpected errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
