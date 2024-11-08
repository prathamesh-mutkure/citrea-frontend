"use client";

import { Bell, Settings, Wallet } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { WalletConnect } from "@/components/WalletConnect";
import { useWallet } from "@/lib/hooks/useWallet";

export default function Home() {
  const { isConnected, error, balance, connectWallet } = useWallet();

  return (
    <div className="flex-1 p-6">
      {/* Top Bar */}
      <div className="flex flex-col space-y-4">
        {/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

        <div className="flex justify-between items-center mb-8">
          <WalletConnect />

          <div className="flex gap-4">
            <button className="p-2 hover:bg-purple-100 rounded-full">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-purple-100 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Assets</h2>
          {!isConnected ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-4">No Wallet Connected</p>
              <button
                onClick={connectWallet}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Connect MetaMask
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ETH Balance</span>
                  <span>{balance} ETH</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          <div className="text-center py-12 text-gray-600">
            <p>No activity yet</p>
            <p className="text-sm mt-2">Your transactions will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
