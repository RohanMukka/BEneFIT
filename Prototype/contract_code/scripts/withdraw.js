require("dotenv").config();
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0xFC8e990544124Bbc14bee0d8c327Cda9C160607b"; // your deployed address
const ABI = require("../../client/src/abi/BenefitLockAndReleaseNoDeadline.json").abi;


// ✅ Step 1: Owner validates the goal for the user
async function validateGoal(userAddress) {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const ownerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, ownerWallet);

  console.log(`🧾 Validating goal for: ${userAddress}`);
  try {
    const tx = await contract.validateGoal(userAddress);
    await tx.wait();
    console.log(`✅ Goal validated. Tx hash: ${tx.hash}`);
  } catch (err) {
    console.error("❌ Validation failed:", err.reason || err.message || err);
  }
}

// ✅ Step 2: User withdraws staked ETH
async function withdrawAsUser() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const userWallet = new ethers.Wallet(process.env.STAKER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, userWallet);

  console.log(`💸 Calling withdraw() as ${userWallet.address}`);
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    console.log(`✅ Withdraw successful. Tx hash: ${tx.hash}`);
  } catch (err) {
    console.error("❌ Withdraw failed:", err.reason || err.message || err);
  }
}

async function main() {
  const userAddress = process.env.USER_ADDRESS;

  await validateGoal(userAddress);
  await withdrawAsUser();
}

main();
