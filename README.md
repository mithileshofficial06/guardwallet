# GuardWallet

**AI-Powered On-Chain Autopay Protection System**

Never miss an autopay again. GuardWallet uses AI to predict cashflow shortfalls and automatically protects funds in a secure vault before your recurring payments are due.

![GuardWallet Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=GuardWallet)

## 🎯 Problem

Millions of salaried workers set up autopay for rent, subscriptions, and bills but often forget about them. When autopay day arrives:
- **Payment fails** → Late fees, service cuts, credit score damage
- **Payment succeeds** → User left with $0 to survive until next salary

This causes financial stress for hundreds of millions globally.

## ✨ Solution

GuardWallet combines **AI prediction** with **blockchain smart contracts** to:
1. **Monitor** your wallet balance and spending patterns
2. **Predict** cashflow shortfalls 3 days in advance
3. **Protect** autopay funds in a secure multisig vault
4. **Earn** 4%+ APY on protected funds via Aave
5. **Build** your on-chain credit score with reputation NFTs
6. **Guide** daily spending with AI budget recommendations

## 🚀 Key Features

### 🤖 AI Cashflow Prediction
- Analyzes transaction history with GPT-4
- Predicts expenses 30 days ahead
- Identifies recurring payment patterns
- Recommends protection amounts

### 💰 Autopay Balance Guardian
- Monitors balance continuously
- Auto-protects funds before due date
- Ensures payments never fail
- Maintains survival minimum

### 👨‍👩‍👧‍👦 Social Recovery Vault
- 2-of-3 multisig protection
- ZK-Email approval (no wallet needed)
- Trusted circle of family/friends
- Prevents impulsive withdrawals

### 📊 Daily Budget Engine
- Calculates safe daily spending
- Auto-adjusts if you overspend
- Push Protocol notifications
- Prevents running out mid-month

### 🌱 Aave Yield Generation
- Protected funds earn 4%+ APY
- Auto-deposits to Aave V3
- 0.5% protocol fee
- Passive income while protected

### 🏆 Reputation & Credit Score
- Bronze/Silver/Gold NFT badges
- Tracks successful payment cycles
- Unlocks undercollateralized loans
- Soulbound (non-transferable)

### 🔐 Account Abstraction
- Face ID / Touch ID login
- No seed phrases needed
- Sponsored gas (user pays nothing)
- Seamless Web2-like UX

## 🏗️ Tech Stack

### Smart Contracts (Solidity)
- **Polygon** - Low-cost blockchain
- **OpenZeppelin** - Secure contract templates
- **Aave V3** - Yield generation
- **Chainlink Automation** - Scheduled payments
- **Safe (Gnosis)** - Multisig vault

### AI Agent (Python)
- **Coinbase AgentKit** - Wallet monitoring
- **LangChain + GPT-4** - Cashflow prediction
- **Web3.py** - Blockchain interaction
- **Push Protocol** - Wallet notifications

### Frontend (Next.js)
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Wagmi + Viem** - Ethereum interactions
- **RainbowKit** - Wallet connection
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
guardwallet/
├── contract/              # Smart contracts
│   ├── contracts/
│   │   ├── GuardVault.sol           # Main vault with Aave
│   │   ├── AutopayGuard.sol         # Chainlink automation
│   │   ├── ReputationNFT.sol        # Credit score NFTs
│   │   ├── AccountAbstraction.sol   # ERC-4337
│   │   └── ZKEmailVerifier.sol      # Email approvals
│   ├── scripts/deploy.js
│   └── hardhat.config.js
│
├── frontend/              # Next.js app
│   ├── app/
│   │   ├── page.tsx               # Home page
│   │   ├── layout.tsx             # Root layout
│   │   └── api/agent/route.ts     # AI agent API
│   └── components/
│       ├── Dashboard.tsx          # Main dashboard
│       ├── VaultSetup.tsx         # Onboarding flow
│       ├── DailyBudget.tsx        # Budget tracker
│       └── ...
│
├── agent/                 # AI agent
│   ├── agent.py                   # Main AI agent
│   ├── predictor.py               # Cashflow prediction
│   ├── notifier.py                # Push notifications
│   └── daily_budget_engine.py     # Budget calculator
│
└── docs/
    ├── SETUP_GUIDE.md
    ├── DEPLOYMENT_GUIDE.md
    └── MIGRATION_VITE_TO_NEXTJS.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MetaMask wallet
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/guardwallet.git
cd guardwallet
```

### 2. Install Contract Dependencies
```bash
cd contract
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Install Python Dependencies
```bash
cd ../agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Setup Environment Variables

**contract/.env:**
```env
PRIVATE_KEY=your_metamask_private_key
ALCHEMY_RPC_URL=your_alchemy_polygon_url
POLYGONSCAN_API_KEY=your_polygonscan_key
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_GUARDVAULT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_POLYGON_RPC=your_alchemy_url
```

**agent/.env:**
```env
OPENAI_API_KEY=your_openai_key
WALLET_ADDRESS=your_wallet_address
CONTRACT_ADDRESS=deployed_vault_address
RPC_URL=your_alchemy_url
```

### 6. Deploy Contracts
```bash
cd contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

### 7. Run AI Agent
```bash
cd ../agent
python agent.py
```

### 8. Start Frontend
```bash
cd ../frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete installation instructions
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deploy to production
- [Migration Guide](MIGRATION_VITE_TO_NEXTJS.md) - Vite to Next.js migration

## 🎬 Demo Flow

1. **Connect Wallet** - RainbowKit integration
2. **Create Vault** - Set survival minimum, add trusted circle
3. **Schedule Autopays** - Add rent, subscriptions, bills
4. **Deposit Funds** - Deposit USDC
5. **AI Analyzes** - Predicts shortfall in 3 days
6. **Auto-Protects** - Moves funds to vault earning yield
7. **Daily Budget** - Shows safe spending amount
8. **Payment Day** - Autopay executes successfully
9. **Earn Badge** - Bronze reputation NFT minted

## 💰 Hosting Costs

### Development (FREE)
- Polygon Mumbai testnet
- Vercel (frontend)
- Railway free tier (agent)

### Production (~$5/month)
- Polygon mainnet (~$2 one-time)
- Vercel (frontend) - FREE
- Railway (AI agent) - $5/month

## 🏆 Hackathon Tracks

### Integrations:
- ✅ **Chainlink** - Automation for scheduled checks
- ✅ **Coinbase** - AgentKit for AI wallet monitoring
- ✅ **Aave** - Yield generation on protected funds
- ✅ **Push Protocol** - Daily budget notifications
- ✅ **Safe** - Multisig vault architecture
- ✅ **Polygon** - Low-cost blockchain deployment

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Live Demo](https://guardwallet.vercel.app)
- [Documentation](https://docs.guardwallet.io)
- [Twitter](https://twitter.com/guardwallet)
- [Discord](https://discord.gg/guardwallet)

## 👥 Team

Built with ❤️ for hackathon

## 🙏 Acknowledgments

- OpenZeppelin for secure contract templates
- Aave for DeFi yield infrastructure
- Chainlink for reliable automation
- Push Protocol for Web3 notifications
- Coinbase for AgentKit framework

---

**GuardWallet** - Making sure your autopay never fails, your money never sits idle, and your financial reputation grows stronger every month. 🚀
