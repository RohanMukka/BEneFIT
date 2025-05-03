## BEneFIT: A Decentralized M2E Fitness Framework

<div align="justify">

Over the past few years, Move-to-Earn (M2E) apps have gained popularity for how they mix fitness with real-world rewards. These apps go beyond just counting steps or calories — they offer actual incentives, like tokens or crypto, for doing something as simple as walking every day. As smartphones, wearables, and health awareness grow, more people are turning to these platforms to stay active and maybe earn something along the way.

Two popular apps in this space are **StepN** and **Sweatcoin**. StepN requires users to buy NFT sneakers to start earning, which can be expensive and a big turn-off for casual users. Sweatcoin is easier to join and rewards you based on steps, but the catch is that those rewards are mostly for in-app offers or discounts with partner brands — they don’t really hold any tradeable monetary value. On the other hand, StepN's tokens can be sold or traded like real cryptocurrency and even used to buy other digital items in their marketplace.

These apps generally use **GPS-based distance tracking combined with accelerometer data** to estimate steps and movement. Sweatcoin, for example, validates a user’s location over time and compares it against the step count recorded by the device to determine authenticity. However, both apps have been targets for fraud through devices like auto-walkers — machines that mimic human movement to farm steps while the user remains inactive.

Our idea, **BEneFIT**, tries to offer something different. While StepN and Sweatcoin focus mostly on movement and external rewards, BEneFIT is designed for people who want to stick to their own fitness goals — and get rewarded for doing so. Instead of following a fixed step count or activity, users can set their own challenges: maybe walking 10,000 steps daily, working out three times a week, or completing a 6-month fitness streak.

To add real commitment, users put in some ETH into a shared pool. Based on how they want to approach it, they can choose between two models:

- In the **redistribution model**, if someone fails to meet their goal, their ETH is **redistributed** to those who succeeded. This way, people who complete their goals — and help validate others — are rewarded more. But we know not everyone likes this idea since it can feel too punishing.

- That’s why we also offer a second option — a **lock-and-release** model. Here, funds are just held by the contract until the user finishes their goal. So if someone promises to stick to a 6-month walking goal, the ETH is returned only after that. This version works better for people who aren’t looking to compete but still want accountability.

In both cases, BEneFIT works anonymously. Users post their goals, group members vote on whether the routines are legit, and validation only succeeds if at least two-thirds approve. Validators are also rewarded — especially when they accept difficult but realistic goals. So, it builds trust while filtering out low-effort entries.

What makes BEneFIT stand out is that it does two things at once:  
→ It helps people stay consistent with their fitness plans,  
→ And it lets them earn something real for their effort.

People already pay for gym memberships or health subscriptions — so the idea of staking ETH for personal accountability isn’t that far-fetched. A lot of us are already investing in our health in some form. And research backs this up.

A study on Sweatcoin [2] showed that even small incentives helped users, especially less active ones, get moving more often. Another study by Lee et al. [1] highlighted that M2E apps face a real threat from fake step generation using automated tools. In their paper, they proposed a robust fraud-detection method using **Convolutional Neural Networks (CNNs)** trained on motion sensor data (accelerometer and gyroscope) to classify walking behavior. Their model achieved **F1-scores up to 0.997** for detecting fake steps and **perfect accuracy (1.000)** for identifying real walking across both known and unseen users and devices. Integrating similar ML-based fraud prevention in BEneFIT could help ensure fairness and protect the staking ecosystem from abuse.

Even more interesting is a recent experiment by Spika et al. [3], where gym-goers in Sweden were offered contracts to commit to their workout plans — and they had to stake their own money. Those who accepted contracts with real financial penalties ended up going to the gym **21% more often**. That’s a strong sign that when people put money on the line, they’re more likely to follow through — especially if it’s their own cash. BEneFIT builds on that exact idea, but adds automation and decentralization through smart contracts.

</div>
