// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Lock-and-Release Fitness Staking with Step Goal
contract BenefitLockAndReleaseNoDeadline {
    struct Goal {
        address user;
        uint256 amount;
        uint256 startTime;
        uint256 stepGoal;
        bool validated;
        bool withdrawn;
    }

    mapping(address => Goal) public goals;
    address public owner;

    event GoalStarted(address indexed user, uint256 amount, uint256 stepGoal);
    event GoalValidated(address indexed user);
    event FundsWithdrawn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Stake ETH and set a step goal
    function startGoal(uint256 _stepGoal) external payable {
        require(goals[msg.sender].amount == 0, "Active goal exists");
        require(msg.value > 0, "Must stake ETH");
        require(_stepGoal > 0, "Step goal must be positive");

        goals[msg.sender] = Goal({
            user: msg.sender,
            amount: msg.value,
            startTime: block.timestamp,
            stepGoal: _stepGoal,
            validated: false,
            withdrawn: false
        });

        emit GoalStarted(msg.sender, msg.value, _stepGoal);
    }

    /// @notice Called by contract owner (oracle) to validate goal
    function validateGoal(address user) external onlyOwner {
        Goal storage goal = goals[user];
        require(goal.amount > 0, "No active goal");
        require(!goal.validated, "Already validated");
        goal.validated = true;
        emit GoalValidated(user);
    }

    /// @notice Withdraw staked ETH after goal is validated
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

    /// @notice Fetch goal status for any user
    function getGoalStatus(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 stepGoal,
        bool validated,
        bool withdrawn
    ) {
        Goal memory g = goals[user];
        return (g.amount, g.startTime, g.stepGoal, g.validated, g.withdrawn);
    }
}
