# GuardWallet - Complete Deployment Guide

## Production Hosting Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER'S BROWSER                    │
│                                                      │
│  Frontend: https://guardwallet.vercel.app           │
│  (React + Wagmi + RainbowKit)                       │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               │                      │
    ┌──────────▼──────────┐  ┌────────▼──────────┐
    │  Polygon Blockchain │  │   AI Agent API    │
    │   (Smart Contracts) │  │  (Railway/Render) │
    │                     │  │                   │
    │  - GuardVault.sol   │  │  - agent.py       │
    │  - AutopayGuard.sol │  │  - predictor.py   │
    │  - ReputationNFT    │  │  - notifier.py    │
    └─────────────────────┘  └───────────────────┘
           (FREE)                 ($5-10/month)
```

---

## Part 1: Deploy Smart Contracts to Polygon

### Step 1: Get Production Ready

**Install dependencies:**
```bash
cd contract
npm install
```

**Create production .env:**
```env
PRIVATE_KEY=your_metamask_private_key_here
ALCHEMY_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### Step 2: Get MATIC for Gas

- Buy MATIC on Coinbase/Binance (~$5 worth)
- Send to your MetaMask wallet
- You'll need ~2-3 MATIC for deployment

### Step 3: Deploy to Polygon Mainnet

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygon
```

**You'll get output like:**
```
GuardVault deployed to: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
AutopayGuard deployed to: 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063
ReputationNFT deployed to: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
```

**Save these addresses!** You need them for frontend and agent.

### Step 4: Verify Contracts (Optional but Recommended)

```bash
npx hardhat verify --network polygon 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

This makes your code visible on PolygonScan for transparency.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Contract Addresses

**Create `frontend/.env.local`:**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_GUARDVAULT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
NEXT_PUBLIC_AUTOPAY_ADDRESS=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063
NEXT_PUBLIC_REPUTATION_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
NEXT_PUBLIC_POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_AGENT_API_URL=https://guardwallet-agent.railway.app
```

### Step 2: Test Build Locally

```bash
cd frontend
npm install
npm run build
npm run start
```

Visit http://localhost:3000 to test production build.

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Select `frontend` folder as root directory
5. Add environment variables
6. Click Deploy

**Your site will be live at:**
```
https://guardwallet.vercel.app
```

### Step 4: Connect Custom Domain (Optional)

1. Buy domain from Namecheap/GoDaddy
2. Add domain in Vercel dashboard
3. Update DNS records
4. Now accessible at: https://guardwallet.io

---

## Part 3: Deploy AI Agent to Railway

### Step 1: Prepare Agent for Deployment

**Create `agent/.env.production`:**
```env
OPENAI_API_KEY=sk-your-key-here
WALLET_ADDRESS=0xYourWalletAddress
CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
PUSH_CHANNEL_ADDRESS=0xYourPushChannel
PORT=8000
```

### Step 2: Create API Server

**Create `agent/server.py`:**
```python
from flask import Flask, jsonify
from agent import GuardWalletAgent
import os

app = Flask(__name__)
agent = GuardWalletAgent()

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/analyze/<address>')
def analyze(address):
    result = agent.analyze_wallet_by_address(address)
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
```

**Update `agent/requirements.txt`:**
```txt
flask
gunicorn
langchain
langchain-openai
openai
web3
python-dotenv
requests
schedule
```

### Step 3: Deploy to Railway

**Option A: Using Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option B: Using Railway Dashboard**
1. Go to railway.app
2. Click "New Project"
3. Connect GitHub repo
4. Select `agent` folder
5. Add all environment variables
6. Railway auto-deploys

**Your API will be live at:**
```
https://guardwallet-agent.railway.app
```

### Step 4: Update Frontend to Use Agent API

**In `frontend/.env.production`, add:**
```env
VITE_AGENT_API_URL=https://guardwallet-agent.railway.app
```

---

## Part 4: Setup Monitoring & Notifications

### Push Protocol Setup

1. Go to push.org/dashboard
2. Create a channel
3. Copy channel address
4. Add to agent .env
5. Users subscribe via frontend

### WalletConnect Setup (Required for Next.js)

1. Go to cloud.walletconnect.com
2. Create new project
3. Copy Project ID
4. Add to frontend/.env.local as NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

### Uptime Monitoring (FREE)

1. Go to uptimerobot.com
2. Add monitor for your agent API
3. Get alerts if it goes down

### Analytics (FREE)

1. Go to analytics.google.com
2. Create property
3. Add tracking code to frontend

---

## 💰 Total Hosting Costs

### One-Time Costs:
- Deploy contracts: ~$2-5 (MATIC gas fees)
- Domain (optional): ~$12/year

### Monthly Costs:
- **Vercel (Frontend):** FREE ✅
- **Railway (AI Agent):** $5/month
- **Blockchain:** FREE (no hosting needed)
- **Total: ~$5/month**

### Annual Cost: ~$72/year ($60 Railway + $12 domain)

---

## 🚀 Quick Deploy Commands

**Full deployment in 3 steps:**

```bash
# 1. Deploy contracts
cd contract
npx hardhat run scripts/deploy.js --network polygon

# 2. Deploy frontend
cd ../frontend
vercel --prod

# 3. Deploy agent
cd ../agent
railway up
```

---

## 📱 Access Your Live App

- **Frontend:** https://guardwallet.vercel.app
- **Agent API:** https://guardwallet-agent.railway.app
- **Contracts:** View on PolygonScan
- **Domain:** https://guardwallet.io (if configured)

---

## 🔄 Continuous Deployment (Auto-Deploy on Git Push)

### Vercel Auto-Deploy:
- Push to GitHub main branch
- Vercel automatically rebuilds and deploys
- Live in ~2 minutes

### Railway Auto-Deploy:
- Push to GitHub main branch
- Railway automatically redeploys
- Live in ~3-5 minutes

### Smart Contracts:
- Cannot auto-deploy (blockchain is immutable)
- Must manually deploy new versions
- Use proxy pattern for upgrades

---

## 🛠️ Alternative Hosting Options

### Budget Option (Everything FREE):
- **Frontend:** Vercel/Netlify (FREE)
- **Agent:** Render free tier (FREE)
- **Contracts:** Polygon Mumbai testnet (FREE)
- **Total: $0/month** (testnet only)

### Professional Option:
- **Frontend:** Vercel Pro ($20/month)
- **Agent:** AWS EC2 ($10/month)
- **Contracts:** Polygon mainnet
- **Domain:** Custom .io domain
- **Total: ~$30/month**

### Enterprise Option:
- **Frontend:** AWS CloudFront + S3
- **Agent:** AWS ECS + Auto-scaling
- **Contracts:** Multi-chain deployment
- **Monitoring:** DataDog/New Relic
- **Total: $100-500/month**

---

## 🔐 Security Checklist

- [ ] Never commit .env files
- [ ] Use different keys for testnet/mainnet
- [ ] Enable 2FA on all hosting platforms
- [ ] Set up contract ownership properly
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Add rate limiting to agent API
- [ ] Monitor for unusual activity

---

## 📞 Support & Monitoring

**Set up alerts for:**
- Agent API downtime
- High error rates
- Smart contract events
- User complaints

**Tools:**
- Sentry for error tracking
- LogRocket for user sessions
- Alchemy webhooks for blockchain events
- Discord bot for alerts

---

## 🎯 Production Checklist

Before going live:

- [ ] Contracts deployed and verified
- [ ] Frontend deployed with correct contract addresses
- [ ] Agent API running and accessible
- [ ] Push Protocol channel created
- [ ] Domain configured (if using)
- [ ] SSL/HTTPS enabled
- [ ] Analytics installed
- [ ] Monitoring setup
- [ ] Backup private keys securely
- [ ] Test with real wallet on mainnet
- [ ] Get audit for smart contracts (if budget allows)

---

## 🚨 Emergency Procedures

**If agent goes down:**
- Railway will auto-restart
- Check logs in Railway dashboard
- Contracts continue working (blockchain is independent)

**If frontend goes down:**
- Vercel has 99.99% uptime
- Users can still interact via PolygonScan
- Redeploy from backup

**If contracts have bug:**
- Cannot change deployed contracts
- Deploy new version
- Migrate users to new contracts
- This is why audits are important!

---

Your GuardWallet is now live and accessible worldwide! 🎉
