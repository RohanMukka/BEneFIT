const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BenefitLockAndReleaseNoDeadline", function () {
  let contract;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Benefit = await ethers.getContractFactory("BenefitLockAndReleaseNoDeadline");
    contract = await Benefit.deploy();
    await contract.waitForDeployment();
  });

  it("should revert withdraw before validation", async function () {
    await contract.connect(user).startGoal(100, { value: ethers.parseEther("1") });
    await expect(contract.connect(user).withdraw()).to.be.revertedWith(
      "Goal not validated yet"
    );
  });

  it("should allow withdraw after owner validation", async function () {
    await contract.connect(user).startGoal(100, { value: ethers.parseEther("1") });

    await expect(contract.validateGoal(user.address))
      .to.emit(contract, "GoalValidated")
      .withArgs(user.address);

    await expect(contract.connect(user).withdraw())
      .to.emit(contract, "FundsWithdrawn")
      .withArgs(user.address, ethers.parseEther("1"));
  });
});
