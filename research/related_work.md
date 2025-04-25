# Related Work
<div align="justify">
## 1. Why Move-to-Earn Is a Big Deal

Getting people to move more is a problem that never seems to go away, no matter how many step counters or fitness apps we install. For a lot of us, those little badges or calorie charts just aren’t enough to keep us going for more than a week or two. This is why Move-to-Earn (M2E) apps have become such an interesting trend in the last few years. The core idea is simple: if you give people something real—money, tokens, or even just the chance to win prizes—they’re much more likely to stick with a new habit.

The M2E space brings together several different worlds: traditional health apps, psychology (how people are motivated), and in some cases, even cryptocurrency and blockchain technology. As smartphones have gotten better and wearables more common, it’s easier than ever to track what people are doing—and just as easy to reward them for it.

## 2. What Are Other People Doing? (Major Apps & Approaches)

### Sweatcoin

Sweatcoin is often the first M2E app that comes up in conversation. Its pitch is straightforward: you walk, your phone tracks your steps, and you get rewarded with Sweatcoins. You can then use these in the app’s own “store” for products, discounts, or sometimes donations. The way it verifies your activity is mostly through your phone’s step counter and GPS, making sure you’re actually outside and moving—not just shaking your phone at home.

The rewards aren’t cash—you can’t exchange Sweatcoins for real money or transfer them outside the platform. Some people love the idea, but others find that the value of the rewards fades pretty quickly, especially if there aren’t offers that appeal to them. The app tries to stop cheating by matching GPS data with steps, but as with any tech, determined cheaters can still sometimes find loopholes.

Interestingly, a 2019 study by Elliott and colleagues [2] looked at how people used Sweatcoin and found that the app really did encourage users, especially the least active ones, to move more. Even non-cash rewards had a positive effect, showing that just a bit of incentive can help nudge people in the right direction.

### StepN

StepN is kind of the next generation of M2E, especially for people who are into crypto. The biggest difference is that StepN users have to buy a special NFT sneaker to get started, which means there’s an upfront cost before you can earn anything. After that, every step you take (validated by GPS and sensors) can earn you tokens (GST, GMT), and these tokens can actually be sold or traded for real money on crypto exchanges. There’s even a marketplace for digital sneaker NFTs and items that boost your earning potential.

But StepN isn’t perfect either. The NFT requirement creates a paywall, so people who are just curious or want to try before they buy may never get started. There’s also the risk that token values can crash, and if the platform doesn’t manage its economy well, the rewards could dry up or become worthless. Like Sweatcoin, StepN works hard to keep things fair, but some users still try to cheat the system with step-simulating devices or by spoofing their location.

### Other M2E Efforts

Other M2E platforms exist, each trying their own spin on the basic formula. GymPact lets people “bet” on their workouts and lose money if they skip. Charity Miles gives people the chance to turn activity into donations. The common thread is the use of real incentives (money, charity, or tokens) to try to drive behavior change, but the details of how data is validated, how rewards are managed, and how new users are brought in can differ quite a bit.

## 3. Fraud, Data Integrity, and the Real-World Problems

One issue that keeps coming up—both in the news and in the research—is how easy it is for people to cheat. It turns out that if you put money or valuable tokens on the line, some users will get creative. From putting their phone on a paint mixer to using spring-loaded contraptions called “auto-walkers,” people have tried all sorts of tricks to rack up fake steps.

A study by Lee et al. [1] tackled this problem head-on. They showed that even advanced apps can be fooled by these devices. Their solution was to use deep learning—specifically, convolutional neural networks (CNNs)—to analyze not just steps, but the actual movement patterns from a phone’s accelerometer and gyroscope. Their model could tell the difference between genuine walking and artificial movement with near-perfect accuracy. This shows that tech can fight back against cheating, but it’s a cat-and-mouse game and not all apps have the resources or know-how to implement such advanced checks.

## 4. Does Money Really Motivate People? (Behavioral Insights)

Besides the tech, it’s also worth asking: does this kind of reward system actually change behavior? According to the evidence, yes—but the details matter.

Spika et al. [3] ran an interesting experiment with gym-goers in Sweden. They compared two groups: one signed up for “soft” commitments (where there’s no real loss if you fail), and the other for “hard” commitments (where you actually put your own money on the line). The hard commitment group went to the gym 21% more often, while the soft commitment group improved by only 8%. This fits with what we know about loss aversion in psychology—people will work harder to avoid losing something than they will to gain a small reward.

Sweatcoin’s own data, as reported by Elliott et al. [2], showed that even rewards that aren’t cash can boost activity, but the effect is stronger when users see real value at stake.

## 5. What’s Missing or Still Unsolved in Current M2E Apps?

From both research and user experience, there are some obvious pain points:

- **Centralized control:** If an app is run by a single company, users have to trust that company not to change the rules, disappear, or misuse funds. Sweatcoin and StepN are both centralized.
- **Barriers to entry:** The NFT paywall in StepN is a turnoff for new users, while Sweatcoin’s rewards are often limited to whatever is on offer that month.
- **Cheating:** As mentioned, the incentive to cheat grows as rewards get more valuable. Most apps can’t fully prevent it.
- **Rigid goals:** Many apps force users to adopt generic goals (“10,000 steps/day”) instead of letting them pick targets that make sense for their lifestyle or fitness level.
- **Reward inflexibility:** If you can’t cash out, transfer, or use your rewards the way you want, the system loses appeal over time.

## 6. How BEneFIT Tries to Solve These Problems

Our project, BEneFIT, was designed with all these issues in mind. Here’s what sets it apart from the platforms above:

- **No middleman:** BEneFIT uses smart contracts on the blockchain, so all funds and rewards are managed automatically and transparently.
- **Pick your own goal:** Users get to decide what fitness means to them, whether that’s steps, workouts, or something else.
- **Real stakes:** Borrowing from Spika et al. [3], users have to lock up real ETH. If they don’t meet their goal, there’s a real consequence (either redistribution or funds are held), so loss aversion kicks in.
- **Peer validation:** Instead of a faceless algorithm, progress is checked by other users in the pool, adding a social and fairness element.
- **Privacy-friendly:** Participation can be anonymous—no need to share personal data.
- **Fraud defense:** The plan is to use machine learning to scan sensor data and stop obvious cheats, following the example set by Lee et al. [1].
- **Choice of reward model:** Some people like competition, others just want to prove something to themselves. BEneFIT lets users pick between a competitive (redistribution) and non-competitive (lock-and-release) approach.


---

## References

1. Lee S. Real Steps or Not: Auto-Walker Detection in Move-to-Earn Applications. *Sensors* (Basel). 2025 Feb 7;25(4):1002. https://doi.org/10.3390/s25041002.  
2. Elliott M, Eck F, Khmelev E, Derlyatka A, Fomenko O. Physical Activity Behavior Change Driven by Engagement With an Incentive-Based App: Evaluating the Impact of Sweatcoin. *JMIR Mhealth Uhealth*. 2019;7(7):e12445. https://doi.org/10.2196/12445.  
3. Spika D, Wickström Östervall L, Gerdtham U, Wengström E. Put a bet on it: Can self-funded commitment contracts curb fitness procrastination? *J Health Econ*. 2024 Dec;98:102943. https://doi.org/10.1016/j.jhealeco.2024.102943.