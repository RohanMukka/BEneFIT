// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Lock-and-Release Fitness Staking (No Deadline)
contract BenefitLockAndReleaseNoDeadline {
    struct Goal {
        address user;
        uint256 amount;
        bool validated;
        bool withdrawn;
    }

    mapping(address => Goal) public goals;
    address public owner;

    event GoalStarted(address indexed user, uint256 amount);
    event GoalValidated(address indexed user);
    event FundsWithdrawn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice User locks ETH for a fitness goal (no deadline)
    function startGoal() external payable {
        require(goals[msg.sender].amount == 0, "Active goal exists");
        require(msg.value > 0, "Must stake ETH");
        goals[msg.sender] = Goal({
            user: msg.sender,
            amount: msg.value,
            validated: false,
            withdrawn: false
        });
        emit GoalStarted(msg.sender, msg.value);
    }

    /// @notice Oracle/validator calls this to mark goal as met (success)
    function validateGoal(address user) external onlyOwner {
        Goal storage goal = goals[user];
        require(goal.amount > 0, "No active goal");
        require(!goal.validated, "Already validated");
        goal.validated = true;
        emit GoalValidated(user);
    }

    /// @notice User withdraws funds after goal is validated
    function withdraw() external {
        Goal storage goal = goals[msg.sender];
        require(goal.amount > 0, "No funds");
        require(goal.validated, "Goal not validated yet");
        require(!goal.withdrawn, "Already withdrawn");
        goal.withdrawn = true;
        uint256 amt = goal.amount;
        goal.amount = 0;
        payable(msg.sender).transfer(amt);
        emit FundsWithdrawn(msg.sender, amt);
    }
}
