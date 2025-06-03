// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Minimal verifier stub used for testing
contract StepVerifier {
    /// @notice Verify a ZK-SNARK proof.
    /// @dev This stub always returns true. Replace with real verifier in production.
    /// @param a First proof element
    /// @param b Second proof element
    /// @param c Third proof element
    /// @param input Public inputs to the proof
    /// @return Whether the proof is valid
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public pure returns (bool) {
        a; b; c; input; // silence unused variable warnings
        return true;
    }
}
