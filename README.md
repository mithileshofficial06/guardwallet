# GuardWallet

AI-powered smart wallet protection system on Polygon with cashflow prediction and emergency multisig.

## Quick Start

### 1. Install Dependencies

**Smart Contracts:**
```bash
cd contract
npm install
```

**AI Agent:**
```bash
cd agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Setup Environment

Create `.env` files in both `contract/` and `agent/` folders using the `.env.example` templates.

### 3. Deploy Contracts

```bash
cd contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

### 4. Run AI Agent

```bash
cd agent
python agent.py
```

## Architecture

- **Smart Contracts**: Solidity contracts on Polygon Mumbai
  - `GuardVault.sol`: Main vault with Aave yield
  - `AutopayGuard.sol`: Chainlink automated payments
  - `ReputationNFT.sol`: Soulbound credit score NFTs

- **AI Agent**: Python-based prediction engine
  - Uses GPT-4 for cashflow prediction
  - Coinbase AgentKit for wallet monitoring
  - Push Protocol for notifications

## Features

✅ Multisig protected balance  
✅ Auto-yield generation via Aave  
✅ AI cashflow prediction  
✅ Smart autopay with Chainlink  
✅ Credit score NFTs  
✅ Web3 notifications  

## Next Steps

1. Build React frontend
2. Integrate RainbowKit wallet connection
3. Add Push Protocol notifications
4. Setup Chainlink automation
5. Deploy to production

## Tech Stack

Blockchain: Solidity, Polygon, Hardhat, OpenZeppelin  
AI: Python, LangChain, GPT-4, Coinbase AgentKit  
Frontend: React, Wagmi, Ethers.js, TailwindCSS  
