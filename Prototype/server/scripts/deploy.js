const hre = require("hardhat");

async function main() {
  // Get contract factory
  const BenefitLockAndReleaseNoDeadline = await hre.ethers.getContractFactory("BenefitLockAndReleaseNoDeadline");

  // Deploy contract
  const benefitLock = await BenefitLockAndReleaseNoDeadline.deploy();

  // Wait for deployment
  await benefitLock.waitForDeployment();

  // Get deployed contract address
  console.log("BenefitLockAndReleaseNoDeadline deployed to:", await benefitLock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
