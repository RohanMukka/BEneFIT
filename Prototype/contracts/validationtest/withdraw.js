require("dotenv").config();
const { ethers } = require("ethers");

// Set your contract address and ABI import
const contractAddress = "0x399F854AAA0424CB360853cbf4a80b66c8cE2960";
const abi = require("../abi/BenefitLockAndReleaseNoDeadline.json").abi;

// Read staker's private key and Sepolia RPC URL from .env
const stakerKey = process.env.STAKER_PRIVATE_KEY;
const rpcUrl = process.env.SEPOLIA_RPC_URL;

async function main() {
  if (!stakerKey || !rpcUrl) {
    throw new Error("Missing STAKER_PRIVATE_KEY or SEPOLIA_RPC_URL in .env!");
  }
  // Connect as staker
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const staker = new ethers.Wallet(stakerKey, provider);
  console.log("Withdrawing as:", staker.address);

  const contract = new ethers.Contract(contractAddress, abi, staker);

  // Call withdraw
  const tx = await contract.withdraw();
  console.log("Withdraw tx sent:", tx.hash);
  await tx.wait();
  console.log("Withdraw complete! ETH returned to your wallet.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
