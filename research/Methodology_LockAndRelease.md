# Methodology – Lock-and-Release Model
<div align="justify">

The BEneFIT project implements a decentralized fitness accountability system through the **Lock-and-Release model**, where users lock ETH when committing to a fitness goal. Upon successful completion, verified via APIs, the ETH is released back to the user — ensuring trustless motivation with no peer competition.

---
## 🧭 Table of Contents
1. [What This Model Does](#1-what-this-model-does)
2. [System Architecture](#2-system-architecture)
3. [User Workflow](#3-user-workflow)
4. [Smart Contract Architecture](#4-smart-contract-architecture)
5. [Data Verification & Fraud Prevention](#5-data-verification--fraud-prevention)
6. [Privacy & Security](#6-privacy--security)
7. [Comparison with Other Models](#7-comparison-with-other-models)
8. [Real-World Use Cases](#8-real-world-use-cases)
9. [Summary](#9-summary)
---
## 1. What This Model Does

The Lock-and-Release model promotes behavior change through **self-commitment and smart contract enforcement**, instead of social comparison or redistribution.

### ✅ Step-by-Step Workflow

1. **Goal Commitment**
   - Users define their fitness goals (e.g., walk 10,000 steps/day for 30 days).
   - ETH is staked via a smart contract through the BEneFIT dApp.
   - Goal parameters (steps, duration) are stored on-chain.

2. **Activity Tracking**
   - Daily step data is fetched using **Google Fit / Apple Health** via OAuth.
   - Users simply stay active—data is synced passively or manually submitted.

3. **Data Validation**
   - At the end of the challenge, the backend verifies if the goal was met.
   - Optionally, an ML model (e.g., CNN) checks for fraud-like fake movement.

4. **ETH Release**
   - If validated, the smart contract **automatically releases** the staked ETH back to the user.
   - If not, ETH remains locked or becomes claimable based on fallback logic.

---

## 2. System Architecture

The system is modular and streamlined to support fully automated, validator-free operation using fitness APIs and optional ML fraud detection.

**Figure 1: System Architecture**

<div align="center">
<img src="./Images/Architecture_LockAndRelease.png" alt="BEneFIT Lock-and-Release Architecture" width="80%">
</div>

- **User Layer:**  
  - Users set personal fitness goals, stake ETH, and track progress through the BEneFIT dApp.

- **Fitness Tracking Layer:**  
  - Fitness data is pulled directly from **Google Fit** or **Apple Health** APIs, ensuring reliability.

- **Backend/Middleware:**  
  - Normalizes API data, verifies completion conditions, and optionally runs an ML fraud-detection engine.

- **Blockchain Layer:**  
  - Smart contracts manage ETH staking, time-bound goals, and automated refund triggers.

---

## 3. User Workflow

The Lock-and-Release process is straightforward, ensuring trustless behavior through verified tracking.

**Figure 2: User Workflow**

<div align="center">
<img src="./Images/workflow_LockAndRelease.png" alt="User Workflow - Lock and Release" width="60%">
</div>

### ➤ Goal Setup
- The user submits a fitness goal (e.g., 10,000 steps/day for 30 days) via the dApp.
- ETH is staked into the smart contract.
- Goal configuration (duration, metrics) is stored on-chain.

### ➤ Activity Monitoring
- Fitness data is fetched via APIs (Google Fit / Apple Health).
- Data is regularly synced or submitted manually via API tokens.
- Optionally, the backend checks for anomalies using ML (e.g., CNN models trained to detect fake walking).

### ➤ Goal Completion & ETH Release
- The backend compares recorded data against the goal.
- If completion conditions are met, the smart contract **automatically releases** the staked ETH back to the user.
- If not met, ETH remains locked or returned after a grace period.

---

## 4. Smart Contract Architecture

The BEneFIT Lock-and-Release contract handles all aspects of the ETH staking lifecycle without any human validation.

**Figure 3: Smart Contract Architecture**

<div align="center">
<img src="./Images/smart_contract_LockAndRelease.png" alt="Lock-and-Release Smart Contract" width="100%">
</div>

### Main Modules

- **Staking Module:** Accepts and locks ETH for submitted goals.
- **Goal Management:** Stores time, metrics, and user requirements.
- **Data Validator Interface:** Expects verified completion signal from backend via oracle or off-chain trigger.
- **Payout Module:** Automatically refunds ETH if the goal is completed.
- **Event Logging:** All transactions, staking, and release events are publicly logged.

### Actors

- **User:** Sets goals, locks ETH, syncs data via API tokens.
- **Backend System:** Verifies goal progress, signals success/failure.
- **Smart Contract:** Controls ETH logic and enforces deadlines.

---

## 5. Data Verification & Fraud Prevention

- Fitness metrics (steps, distance, duration) are fetched directly via Google Fit / Apple Health APIs.
- Optional CNN-based fraud detection can be run off-chain to classify real vs fake motion.
- Only verified data triggers ETH release; tampered or incomplete data results in failed completion.

---

## 6. Privacy & Security

- No user registration — only wallet addresses are used.
- Fitness data is hashed or tokenized to avoid storing raw values on-chain.
- The platform avoids third-party validators, ensuring full automation and data integrity.
- OAuth tokens are stored off-chain and never exposed on-chain.
- Backend can use JWT authentication to prevent unauthorized validation attempts.
- Smart contracts are open-source and auditable.

---

## 7. Comparison with Other Models

| Feature                    | Lock-and-Release       | Redistribution Model     | Traditional Fitness Apps |
|---------------------------|------------------------|---------------------------|---------------------------|
| Validators Required        | ❌ None                | ✅ Peer-based voting       | ❌ Centralized judgment   |
| ETH Loss on Failure        | ❌ No                  | ✅ Yes (redistributed)     | ❌ No stakes involved     |
| Privacy                    | ✅ Wallet-only         | ⚠️ Peer visibility         | ❌ Full identity required |
| Data Verification          | ✅ API + Optional ML   | ✅ API + Voting            | ❌ Often manual           |
| Smart Contract Enforcement | ✅ Yes                 | ✅ Yes                     | ❌ No                     |
| Ideal Use Case             | Solo Challenges        | Group Competitions        | General Use               |

---

## 8. Real-World Use Cases

- 🎯 **Step-based Challenges:** Walk 10,000 steps/day for 30 days  
- 🧘 **Consistency Goals:** Exercise 4 out of 7 days/week  
- 🚴 **Cycling Goals:** Ride 100km within 14 days  
- 🏃 **Running Targets:** Run 5km under 30 mins within a month  

This model offers customizable, private, and non-competitive fitness commitments using real ETH incentives and reliable fitness data.

---

## 9. Summary

The Lock-and-Release model is a fully automated, non-punitive mechanism to promote fitness adherence through crypto incentives. By eliminating peer validators and relying on **API-based data verification**, BEneFIT ensures a seamless and fair experience that respects user privacy and provides accountability through on-chain commitments.

</div>
