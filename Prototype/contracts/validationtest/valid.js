const { ethers } = require("hardhat");

async function main() {
  // Replace with your contract name and address
  const contract = await ethers.getContractAt(
    "BenefitLockAndReleaseNoDeadline",
    "0x399F854AAA0424CB360853cbf4a80b66c8cE2960"
  );
  // Replace with your staker's address
  const staker = "0x45a7d83b7d889cb2819fe2a52d273361aacc36fe";
  const tx = await contract.validateGoal(staker);
  await tx.wait();
  console.log("Goal validated for:", staker);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
