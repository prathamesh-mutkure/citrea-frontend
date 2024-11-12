"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@/lib/hooks/useWallet";
import React from "react";

export function WalletConnect() {
  const { isConnected, account, balance, connectWallet } = useWallet();

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
      {isConnected ? (
        <>
          <span className="text-gray-600 mr-2">Balance:</span>
          <span className="text-xl font-bold">{balance} cBTC</span>
          <span className="ml-4 text-gray-600">{formatAddress(account)}</span>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <Wallet size={20} className="mr-2" />
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
