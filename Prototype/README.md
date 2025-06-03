# BEneFIT Project

This project is a decentralized fitness accountability platform where users stake ETH toward fitness goals, verified by a smart contract.

---
## 🛠️ Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [MetaMask browser extension](https://metamask.io/) for interacting with Ethereum
- [Hardhat](https://hardhat.org/) (comes with the project; installed via `npm install`)
- [Git](https://git-scm.com/) (optional, for cloning the repo)

You should also have:
- Basic familiarity with React and Ethereum transactions
- A browser like Chrome or Firefox (MetaMask compatible)
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

---

## 🚢 Deploying the React Client to Vercel

1. **Build the frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```
2. **Create a new Vercel project** and set the project root to `Prototype/client` if importing from Git.
3. **Add environment variables** in the Vercel dashboard:
   - `REACT_APP_CONTRACT_ADDRESS` – address of the deployed contract
   - `REACT_APP_GOOGLE_CLIENT_ID` – OAuth client ID for Google Fit
   - `REACT_APP_SERVER_URL` – URL of the backend (e.g. `https://your-api.vercel.app`)
4. **Deploy**. Vercel will serve the static React build.

If you also deploy the backend (e.g., as a separate service), configure `SERVER_URL` and `FRONTEND_URL` there so OAuth redirects work correctly.

