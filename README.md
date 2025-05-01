# BEneFIT: A Decentralized Fitness Accountability Framework

## 🧠 Overview

BEneFIT is a research initiative aimed at exploring the intersection of behavioral psychology, fitness accountability, and decentralized technologies. The objective of this project is to critically analyze existing decentralized fitness incentive platforms—such as Sweatcoin, Stepn, and GymPact—evaluate their strengths and limitations, and propose a novel framework that enhances user motivation, protects privacy, and ensures fair distribution of rewards.

This repository contains all the materials related to the research, including documentation, literature reviews, system design proposals, and implementation resources that contribute to the proposed framework.

---

## 🎯 Project Goals

- **Literature Review**: Investigate the structure and methodologies of both traditional and decentralized fitness platforms.
- **Gap Analysis**: Identify key limitations in current systems, particularly in trust models, data verification processes, user incentives, and tokenomics.
- **Framework Design**: Introduce a decentralized system that:
  - Preserves anonymity and protects user data privacy
  - Promotes fair and transparent reward distribution
  - Minimizes the risk of cheating or spoofing through verifiable data inputs
  - Encourages long-term behavior change through ethical incentive design
- **Prototype (Optional)**: Develop a proof-of-concept dApp with a minimal smart contract and UI integration to demonstrate key mechanisms.

---

## 💡 Improvements Introduced

Several enhancements were incorporated to address challenges commonly found in decentralized fitness platforms:

- **Decentralization Justification**: This framework removes the reliance on a centralized authority by utilizing anonymous, verifiable goal submission and smart contract-enforced fund pooling.
- **Trust Model for Fitness Data**: The system proposes connecting with Google Fit or Apple Health APIs while employing security measures such as timestamps, usage monitoring, or data attestation methods to mitigate tampering risks.
- **Reward Model Refinement**: Instead of implementing a binary success/fail penalty model, the framework considers adaptive reward distribution mechanisms (e.g., partial refunds, milestones, or supporter roles) to maintain engagement while upholding accountability.

---

## ⚙️ Key Features (Planned)

- Anonymous submission of user-defined fitness goals  
- Peer-based goal approval and validation  
- Customizable goal types beyond step counts (e.g., running duration, weekly streaks)  
- ETH staking into smart contract-based pools  
- Weekly/monthly data verification using mobile health tracking APIs  
- Payout logic based on successful goal completion and fund redistribution  
