// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StepVerifier.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BenefitRedistributionZKP is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    enum GoalStatus { Submitted, Approved, Rejected, Completed, Failed }

    struct Goal {
        address user;
        uint256 stake;
        bytes32 goalHash;
        GoalStatus status;
        bool zkpSubmitted;
        bool chainlinkVerified;
        address[] rewardRecipients;
    }

    uint256 public goalCounter;
    mapping(uint256 => Goal) public goals;
    address public owner;
    StepVerifier public verifier;

    // Chainlink config
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    event GoalSubmitted(uint256 goalId, address user);
    event ZKPVerified(uint256 goalId);
    event ChainlinkValidated(uint256 goalId);
    event StakeReleased(uint256 goalId, address to);
    event GoalFailed(uint256 goalId);
    event StakeRedistributed(uint256 goalId, address[] to);

    constructor(
        address _verifier,
        address _link,
        address _oracle,
        bytes32 _jobId,
        uint256 _fee
    ) {
        owner = msg.sender;
        verifier = StepVerifier(_verifier);
        setChainlinkToken(_link);
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    function submitGoal(bytes32 _goalHash) external payable {
        require(msg.value > 0, "Stake required");
        goals[goalCounter] = Goal({
            user: msg.sender,
            stake: msg.value,
            goalHash: _goalHash,
            status: GoalStatus.Approved,
            zkpSubmitted: false,
            chainlinkVerified: false,
            rewardRecipients: new address[](0)
        });

        emit GoalSubmitted(goalCounter, msg.sender);
        goalCounter++;
    }

    function submitZKPProof(
        uint256 goalId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) external {
        Goal storage g = goals[goalId];
        require(msg.sender == g.user, "Not your goal");
        require(g.status == GoalStatus.Approved, "Not approved");
        require(!g.zkpSubmitted, "Already submitted");

        bool verified = verifier.verifyProof(a, b, c, input);
        if (verified) {
            g.status = GoalStatus.Completed;
            g.zkpSubmitted = true;
            payable(g.user).transfer(g.stake);
            emit ZKPVerified(goalId);
            emit StakeReleased(goalId, g.user);
        } else {
            requestChainlinkValidation(goalId);
        }
    }

    function requestChainlinkValidation(uint256 goalId) internal {
        Goal storage g = goals[goalId];
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("goalId", uint2str(goalId));
        sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, bool valid) public recordChainlinkFulfillment(_requestId) {
        uint256 goalId = uint256(_requestId); // replace with mapping if needed
        Goal storage g = goals[goalId];
        if (valid) {
            g.status = GoalStatus.Completed;
            g.chainlinkVerified = true;
            payable(g.user).transfer(g.stake);
            emit ChainlinkValidated(goalId);
            emit StakeReleased(goalId, g.user);
        } else {
            g.status = GoalStatus.Failed;
            redistributeStake(goalId);
        }
    }

    function redistributeStake(uint256 failedGoalId) internal {
        Goal storage failed = goals[failedGoalId];
        uint256 rewardCount = 0;

        for (uint i = 0; i < goalCounter; i++) {
            if (goals[i].status == GoalStatus.Completed) {
                rewardCount++;
                failed.rewardRecipients.push(goals[i].user);
            }
        }

        if (rewardCount == 0) return;
        uint256 share = failed.stake / rewardCount;

        for (uint i = 0; i < failed.rewardRecipients.length; i++) {
            payable(failed.rewardRecipients[i]).transfer(share);
        }

        emit StakeRedistributed(failedGoalId, failed.rewardRecipients);
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
} 
