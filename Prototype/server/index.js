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
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// In-memory token storage
const tokenStorage = new Map();

// Health check
app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

// OAuth callback route to exchange code for tokens
app.get("/oauth-callback", async (req, res) => {
  const { code, state } = req.query;
  const redirect_uri = "http://localhost:5050/oauth-callback";

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const accessToken = response.data.access_token;

    // Save token in memory mapped to user wallet (from `state`)
    tokenStorage.set(state, { access_token: accessToken });

    // 🔁 Redirect back to frontend cleanly (no token in URL)
    res.redirect(`http://localhost:3000/validate?user=${state}`);
  } catch (error) {
    console.error("OAuth callback error", error.response?.data || error.message);
    res.status(500).send("OAuth failed");
  }
});



// Validate steps using saved token
app.post("/api/validate-steps", async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tokenInfo = tokenStorage.get(userAddress);

    if (!tokenInfo) return res.status(400).json({ error: "User not authorized" });

    const goal = await contract.getGoalStatus(userAddress);
    const startTimeMillis = Number(goal[1]) * 1000;
    const stepGoal = Number(goal[2]);
    const endTimeMillis = Date.now();

    const response = await axios.post("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
      startTimeMillis,
      endTimeMillis
    }, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        "Content-Type": "application/json"
      }
    });

    let totalSteps = 0;
    const buckets = response.data.bucket || [];
    for (const bucket of buckets) {
      const dataset = bucket.dataset[0];
      if (dataset?.point?.length > 0) {
        for (const point of dataset.point) {
          totalSteps += point.value[0].intVal || 0;
        }
      }
    }

    if (totalSteps >= stepGoal) {
      return res.json({ success: true, steps: totalSteps, message: "✅ Goal reached!" });
    } else {
      return res.json({ success: false, steps: totalSteps, message: `❌ Need ${stepGoal - totalSteps} more steps.` });
    }
  } catch (err) {
    console.error("❌ Step validation error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to validate steps" });
  }
});

// On-chain validation from backend oracle
app.post("/api/validate-onchain", async (req, res) => {
  const { userAddress } = req.body;
  if (!userAddress) return res.status(400).json({ message: "Missing userAddress" });

  try {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const tx = await contractWithSigner.validateGoal(userAddress);
    await tx.wait();
    res.status(200).json({ message: "✅ Goal validated on-chain!" });
  } catch (err) {
    console.error("❌ On-chain validation error:", err);
    res.status(500).json({ message: "❌ On-chain validation failed", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});



