# BEneFIT – Redistribution Model Methodology

<div align="justify">

BEneFIT introduces a **trustless, decentralized fitness accountability platform** combining behavioral psychology and decentralized finance (DeFi). This model uses ETH staking and peer validation to promote commitment to personal fitness goals while deterring freeloading or cheating. It offers a privacy-respecting, transparent alternative to centralized apps like Stepn or Sweatcoin.

---

## 🚀 Introduction

Incentivizing fitness with monetary rewards is not new—apps like **Stepn**, **Sweatcoin**, and **GymPact** have attempted this. However, they often rely on **centralized control**, **inflationary tokens**, or **non-transparent data verification**.

**BEneFIT adds value through decentralization by:**
- Using **real ETH staking** rather than speculative tokens.
- Relying on **peer validation** and **smart contract-enforced rules**.
- Providing **open, transparent audits** of every vote and payout.
- Ensuring **pseudonymity and data privacy**.

---

## 🏗️ 1. System Architecture

BEneFIT is structured into five functional layers to ensure modularity, scalability, and minimal trust assumptions:

<div align="center">
<img src="./Images/Architecture.png" alt="BEneFIT System Architecture" width="80%">
</div>

- **User Interface Layer**: dApp for users to set goals, stake ETH, and view progress.
- **Fitness Tracking Layer**: Integrates with **Google Fit** and **Apple Health** for automatic data sync.
- **Middleware Layer**: Fetches and standardizes fitness data; runs optional ML-based fraud detection.
- **Blockchain Layer**: Hosts the smart contract managing staking, voting, and redistribution.
- **Validation Layer**: Peer users vote anonymously to validate goals and data.

---

## 🔁 2. User Workflow

BEneFIT’s process ensures accountability through community governance and cryptographic verification.

<div align="center">
<img src="./Images/workflow.png" alt="BEneFIT User Workflow" width="60%">
</div>

### 🟢 2.1 Group Approval

- A user submits a fitness goal (e.g., 10,000 steps/day for 7 days) and stakes ETH.
- The goal is anonymized and sent to a random validator pool.
- If **2/3** approve, the goal is accepted and the pool is locked.

### 📊 2.2 Data Collection

- User completes activities during the period.
- Data is fetched from APIs or manually entered and hashed.
- Optional ML module flags unusual patterns (e.g., unrealistic spikes).

### ✅ 2.3 Validation & Payout

- After the deadline, validators review submitted fitness data.
- If **2/3** approve, the stake is refunded (or rewarded).
- If rejected, the stake is **redistributed** among other compliant users.

---

## 🔐 3. Smart Contract Architecture

BEneFIT’s smart contract is modular for clarity and gas efficiency.

<div align="center">
<img src="./Images/smart_contract.png" alt="Smart Contract Design" width="100%">
</div>

### 🔧 Key Modules

| Module                  | Purpose                                             |
|--------------------------|-----------------------------------------------------|
| **Staking**             | Manages deposits and participant grouping            |
| **Goal Management**     | Stores goals and tracks approval voting              |
| **Data Submission**     | Accepts hashed fitness data with timestamps          |
| **Validation**          | Tallies validator votes for both goals and data      |
| **Payout/Redistribution** | Redistributes ETH based on consensus result       |
| **Storage/Events**      | Tracks mappings and emits events for transparency    |

### 👤 Actors

- **User**: Submits goals/data, stakes ETH, receives outcomes.
- **Validator**: Approves/rejects goals and data; earns incentives.
- **Oracle (Optional)**: Fetches data directly (e.g., via Chainlink).

---

## 🧠 4. Data Verification & Fraud Prevention

- **Fitness APIs**: OAuth-secured access to Google Fit/Apple Health.
- **Hashing**: All submissions are cryptographically hashed to protect raw data.
- **ML Flagging**: Optional model detects unrealistic inputs (e.g., fake GPS).
- **Validator Voting**: Prevents collusion via random pool assignment and ETH staking.

---

## 🔒 5. Privacy & Security

- Users are **pseudonymous**: only wallet addresses are used.
- Fitness data is **hashed** before blockchain submission.
- Validator votes and contract events are **public and auditable**, ensuring accountability without revealing personal data.

---

## 🔄 6. Trust Assumptions

BEneFIT maintains decentralization with the following assumptions:

- Data from Google Fit/Apple Health is tamper-resistant in most real-world use.
- Validators are randomly selected and incentivized to be honest.
- Cryptographic hashing and timestamps allow verification without revealing raw input.
- ML + peer review makes falsification costly and easily rejected.

---

## 📚 7. Lessons from Real-World dApps

From analyzing **Stepn** and **Sweatcoin**, we identified key flaws:

| App       | Problem                        | BEneFIT's Solution                         |
|-----------|--------------------------------|--------------------------------------------|
| **Stepn** | Token inflation and poor retention | Uses ETH (non-inflationary), real staking  |
| **Sweatcoin** | Centralized data & rewards | Peer-reviewed, on-chain logic with API data |
| Both      | No fraud resistance            | ML + peer validation + hash-based audit    |

---

## 🧾 8. Example Walkthrough

> **Alice stakes 0.1 ETH** to complete 10,000 steps daily for 7 days.  
> Validators approve her goal (4 of 5 votes).  
> She submits hashed step data synced via Google Fit.  
> Validators approve again (3 of 5).  
> **She gets refunded 0.1 ETH + 0.02 ETH from a failed participant’s stake**.

---

## 🔮 9. Future Work

- 🛡️ **ZK-Proofs**: For validating goal completion without revealing step counts.
- ⚙️ **Decentralized Oracles**: Chainlink Functions for API fetch.
- ⭐ **Validator Reputation**: Track vote history to weigh votes.
- 📱 **Mobile Companion App**: For real-time goal tracking and UI education.
- 💬 **Community Moderation**: Dispute resolution and challenge appeals.

---

## ✅ Summary

BEneFIT creates a **privacy-preserving, incentive-aligned fitness challenge platform** that is transparent, secure, and decentralized. By combining on-chain logic with peer validation and privacy-by-design, it addresses the core problems of centralized M2E platforms and sets a new precedent for community-powered fitness motivation.

</div>
