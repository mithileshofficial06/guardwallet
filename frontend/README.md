# GuardWallet Frontend - Next.js

AI-Powered Autopay Protection System built with Next.js 15, TypeScript, and Web3.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum interactions
- **RainbowKit** - Wallet connection UI
- **Viem** - Ethereum utilities
- **TanStack Query** - Data fetching

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_GUARDVAULT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
NEXT_PUBLIC_AUTOPAY_ADDRESS=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063
NEXT_PUBLIC_REPUTATION_ADDRESS=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
NEXT_PUBLIC_POLYGON_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── agent/
│   │       └── route.ts          # AI Agent API proxy
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── providers.tsx             # Web3 providers (Wagmi, RainbowKit)
│   └── globals.css               # Global styles
├── components/
│   ├── Dashboard.tsx             # Main dashboard
│   ├── VaultSetup.tsx            # 3-step onboarding
│   ├── DailyBudget.tsx           # Budget tracker
│   ├── AutopayList.tsx           # Autopay management
│   ├── YieldTracker.tsx          # Aave yield display
│   └── ReputationBadge.tsx       # Credit score NFT
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

## Key Features

### ✅ Wallet Connection
- RainbowKit UI for MetaMask, WalletConnect, Coinbase Wallet
- Automatic network switching
- Account change detection

### ✅ Vault Setup Flow
- Step 1: Set survival minimum
- Step 2: Add trusted circle
- Step 3: Schedule autopays

### ✅ Dashboard
- Real-time balance display
- Daily budget tracking
- Autopay status
- Yield earnings from Aave
- Credit score reputation

### ✅ AI Integration
- Daily budget recommendations
- Cashflow predictions
- Spending insights
- Autopay protection alerts

## API Routes

### `/api/agent?address=0x...`
Fetches AI predictions for wallet address

**Response:**
```json
{
  "daily_budget": 25.50,
  "protected_balance": 1250,
  "recommendations": ["..."]
}
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Manual Deployment

```bash
npm run build
# Upload .next folder to hosting
```

## Environment Setup

### Get WalletConnect Project ID
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create new project
3. Copy Project ID

### Get Alchemy API Key
1. Go to [alchemy.com](https://www.alchemy.com)
2. Create app on Polygon Mumbai
3. Copy API key

## Common Issues

### Wallet not connecting
- Check WalletConnect Project ID
- Ensure MetaMask is installed
- Try refreshing the page

### Contract not found
- Verify contract addresses in .env.local
- Ensure correct network (Mumbai/Polygon)
- Check RPC URL is valid

### Build errors
- Clear `.next` folder
- Delete `node_modules`
- Run `npm install` again

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Next.js Benefits

✅ **SEO Friendly** - Server-side rendering  
✅ **Fast Performance** - Automatic code splitting  
✅ **API Routes** - Backend API in same project  
✅ **TypeScript** - Full type safety  
✅ **Image Optimization** - Automatic image optimization  
✅ **Easy Deployment** - One-click Vercel deploy  

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Viem Documentation](https://viem.sh)
