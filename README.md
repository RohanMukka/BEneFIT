# BEneFIT Project

This project is a decentralized fitness accountability platform where users stake ETH toward fitness goals, verified by a smart contract.

---

## 📚 How to Run

### 1. Start the Frontend
Go to the `client/` folder and run:
```bash
cd client
npm install
npm start
```
- This will run the React frontend at [http://localhost:3000](http://localhost:3000)

---

### 2. Start the Smart Contract Server
Go to the `server/` folder and run:
```bash
cd server
npx hardhat node
```
- This will start a local blockchain at [http://localhost:8545](http://localhost:8545)

---

## 🚀 Deploy Smart Contracts Locally

In a new terminal window (after starting the Hardhat node), go to the `server/` folder and run:
```bash
cd server
npx hardhat run scripts/deploy.js --network localhost
```
- This will deploy your smart contracts to the local blockchain.
- After deployment, copy the contract address to connect your frontend with the deployed contract.

---

That's it!
- Frontend: `client/`
- Server (Contracts): `server/`

✅ Now you are ready to interact with your decentralized fitness app!

