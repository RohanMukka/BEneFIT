const hre = require("hardhat");

async function main() {
  const Benefit = await hre.ethers.getContractFactory("BenefitLockAndReleaseNoDeadline");
  const benefit = await Benefit.deploy();         // Deploys contract
  await benefit.waitForDeployment();              // Waits for deployment (Ethers v6+)

  // To get the address:
  console.log("Contract deployed to:", await benefit.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
