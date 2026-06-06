import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig, useAccount, useConnect, useDisconnect } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import Dashboard from './components/Dashboard';
import VaultSetup from './components/VaultSetup';
import '@rainbow-me/rainbowkit/styles.css';

function App() {
  const { address, isConnected } = useAccount();
  const [hasVault, setHasVault] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">GuardWallet</h1>
          </div>
          
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Never Miss an Autopay Again
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered protection for your recurring payments
            </p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        ) : !hasVault ? (
          <VaultSetup onComplete={() => setHasVault(true)} />
        ) : (
          <Dashboard address={address} />
        )}
      </main>
    </div>
  );
}

export default App;
