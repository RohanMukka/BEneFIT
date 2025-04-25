# Related Work

## 1. Introduction to Move-to-Earn (M2E) Apps

Move-to-Earn (M2E) applications have emerged as a novel intersection of fitness technology, behavioral psychology, and (in some cases) decentralized finance. Unlike traditional fitness trackers, M2E platforms reward users for physical activity with tokens, in-app credits, or even cryptocurrency, thus transforming exercise from a purely intrinsic or health-motivated activity into a potentially lucrative pursuit.

**Motivation for M2E:**  
The M2E approach is grounded in behavioral science principles such as reward shaping, loss aversion, and peer accountability. Research consistently shows that extrinsic incentives, when properly designed, can boost engagement in health-promoting behaviors—especially among otherwise inactive or unmotivated users.

---

## 2. Review of Existing Platforms

### 2.1 Sweatcoin

**Sweatcoin** is one of the earliest and most popular M2E apps. It converts a user’s verified steps into “Sweatcoins,” which can be redeemed for in-app rewards such as discounts, merchandise, or charitable donations.  
- **Data Verification:** Sweatcoin employs GPS data alongside accelerometer readings to check that steps are genuine and correspond to actual distance covered outdoors.  
- **Limitations:** Rewards have no real-world cash value and cannot be traded or withdrawn, and the system is closed-source with centralized management.
- **Effectiveness:** According to Elliott et al. (2019) [2], Sweatcoin’s modest incentives can motivate significant behavioral change, especially in users with lower baseline activity levels.

### 2.2 StepN

**StepN** builds on the M2E model by integrating blockchain, NFTs, and cryptocurrencies. Users must purchase NFT “sneakers” to participate, after which they can earn crypto tokens (GST, GMT) by walking or running.
- **Marketplace Economy:** Tokens and NFTs have real-world value and can be traded on crypto exchanges, providing direct financial incentives.
- **Barriers and Risks:** The NFT requirement creates a financial barrier to entry and exposes users to market volatility and token inflation.  
- **Fraud Detection:** Like Sweatcoin, StepN attempts to validate activity through GPS and device sensors, but remains vulnerable to spoofing and automation attacks.

### 2.3 Other M2E Efforts

Other notable platforms include **GymPact**, which uses escrowed payments and third-party verification, and **Charity Miles**, which donates earned rewards to charity. All share similar themes of activity tracking, reward, and validation but differ in ecosystem openness, incentive structure, and technical design.

---

## 3. Fraud, Data Integrity, and Validation Challenges

A persistent challenge in M2E apps is **preventing users from faking physical activity**. Both Sweatcoin and StepN are susceptible to:
- **Auto-walking devices:** Mechanical or electronic devices that shake or move the phone to simulate steps
- **GPS spoofing:** Manipulating device location to simulate outdoor movement
- **Step injection or app modification:** Tampering with the app or device to generate false data

**Research Response:**  
Lee et al. (2025) [1] conducted an in-depth study of M2E fraud, highlighting that auto-walking devices can generate tens of thousands of fake steps daily. To address this, they designed a detection system using **Convolutional Neural Networks (CNNs)** trained on smartphone sensor data (accelerometer, gyroscope). Their approach achieved nearly perfect accuracy (F1-score of 0.997) in distinguishing between genuine walking and simulated movement—demonstrating that machine learning can substantially improve the integrity of M2E rewards.

---

## 4. Incentive Design and Behavioral Science

The effectiveness of M2E platforms is not solely a function of their technical design but also the **structure of their incentives and social features**.

- **Soft vs. Hard Commitments:**  
  Spika et al. (2024) [3] conducted a field experiment on gym attendance, comparing “soft” (no penalty) vs. “hard” (self-funded, loss-penalty) commitment contracts. They found that hard contracts—where users risked their own money—led to a **21% increase in gym visits** compared to 8% for soft commitments.  
  This suggests that real financial stakes significantly boost adherence to fitness goals, particularly when the loss is tangible and immediate.

- **Group Validation and Peer Support:**  
  Many M2E systems, including BEneFIT, are exploring group-based models where participants validate each other’s progress. Research indicates that peer accountability, social recognition, and transparent validation can help maintain engagement and fairness, while also distributing trust more broadly than centralized admin models.

---

## 5. Lessons Learned and Gaps Identified

Despite their popularity, existing M2E apps face several limitations:

- **Centralization:** Most platforms (Sweatcoin, StepN) rely on closed, centralized servers, making them vulnerable to policy changes, misuse of funds, and lack of transparency.
- **Barrier to Entry:** Requiring NFT purchase (as in StepN) limits participation and creates financial risk for users.
- **Reward Limitations:** Non-cash, in-app-only rewards may not sufficiently motivate all users, particularly in the long term.
- **Fraud Vulnerability:** Even with GPS and step validation, automated and spoofed activity remains a persistent threat.
- **Lack of Customization:** Many platforms enforce rigid activity goals rather than allowing users to define meaningful, personalized objectives.

---

## 6. How BEneFIT Builds on Related Work

BEneFIT is designed to directly address these shortcomings:

- **Decentralization:** By using smart contracts, BEneFIT enables transparent, trustless management of user stakes and reward distribution, minimizing reliance on any central coordinator.
- **Custom Goals:** Users set their own fitness targets (steps, duration, etc.), increasing relevance and motivation.
- **Real Financial Stakes:** Inspired by findings from Spika et al. [3], users risk actual cryptocurrency (ETH), leveraging loss aversion to reinforce commitment.
- **Peer Validation and Anonymity:** Progress is validated through group voting, and users participate anonymously to minimize bias and privacy concerns.
- **Advanced Fraud Detection:** The framework proposes integrating machine-learning-based sensor analysis (as in Lee et al. [1]) to minimize manipulation.
- **Reward Flexibility:** BEneFIT’s dual models (redistribution and lock-release) accommodate both competitive and non-competitive users.

By synthesizing best practices from existing apps, incorporating peer-reviewed findings, and addressing gaps highlighted in the literature and by critics, BEneFIT aims to offer a **fairer, more inclusive, and more transparent alternative** to current M2E solutions.

---

## References

1. Lee S. Real Steps or Not: Auto-Walker Detection in Move-to-Earn Applications. *Sensors* (Basel). 2025 Feb 7;25(4):1002. https://doi.org/10.3390/s25041002.  
2. Elliott M, Eck F, Khmelev E, Derlyatka A, Fomenko O. Physical Activity Behavior Change Driven by Engagement With an Incentive-Based App: Evaluating the Impact of Sweatcoin. *JMIR Mhealth Uhealth*. 2019;7(7):e12445. https://doi.org/10.2196/12445.  
3. Spika D, Wickström Östervall L, Gerdtham U, Wengström E. Put a bet on it: Can self-funded commitment contracts curb fitness procrastination? *J Health Econ*. 2024 Dec;98:102943. https://doi.org/10.1016/j.jhealeco.2024.102943.  

---