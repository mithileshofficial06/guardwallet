"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import VaultSetup from "@/components/VaultSetup";

export default function Home() {
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
          
          <ConnectButton />
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
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : !hasVault ? (
          <VaultSetup onComplete={() => setHasVault(true)} />
        ) : (
          <Dashboard address={address as string} />
        )}
      </main>
    </div>
  );
}
