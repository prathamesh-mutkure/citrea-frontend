"use client";

import React, { useState } from "react";
import {
  Clock,
  ChevronDown,
  User,
  Bookmark,
  Settings,
  CheckCircle2,
  Copy,
} from "lucide-react";

const tokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "2.5",
    value: "$4,612.50",
    icon: "⟠",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,000.00",
    value: "$1,000.00",
    icon: "💵",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: "500.00",
    value: "$500.00",
    icon: "💵",
  },
  {
    symbol: "DAI",
    name: "Dai",
    balance: "750.00",
    value: "$750.00",
    icon: "💵",
  },
];

const recentAddresses = [
  { name: "John Wallet", address: "0x1234...5678", lastUsed: "2 days ago" },
  { name: "Trading Account", address: "0x8765...4321", lastUsed: "5 days ago" },
  { name: "Savings Wallet", address: "0x9876...1234", lastUsed: "1 week ago" },
];

const savedAddresses = [
  {
    name: "Personal Vault",
    address: "0x2468...1357",
    notes: "Cold storage wallet",
  },
  {
    name: "DeFi Wallet",
    address: "0x1357...2468",
    notes: "For DeFi transactions",
  },
];

const recentTransactions = [
  {
    hash: "0x1234...5678",
    type: "send",
    token: "ETH",
    amount: "0.5",
    to: "0x8765...4321",
    status: "confirmed",
    timestamp: "2 hours ago",
  },
  {
    hash: "0x8765...4321",
    type: "send",
    token: "USDC",
    amount: "100",
    to: "0x9876...1234",
    status: "pending",
    timestamp: "5 hours ago",
  },
];

const SendPage = () => {
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [gasOption, setGasOption] = useState("normal");
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleSend = () => {
    if (!isConnected) return;
    console.log("Sending transaction...");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Form */}
        <div className="space-y-6">
          {/* Send Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Send Tokens</h2>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Token
                </label>
                <div className="relative">
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-lg appearance-none pr-10"
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.icon} {token.symbol} - Balance: {token.balance}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-50 border rounded-lg"
                  />
                  {selectedToken && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      ${(parseFloat(amount || 0) * 1845.2).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-3 bg-gray-50 border rounded-lg pr-10"
                  />
                  <button
                    onClick={() => setShowAddressBook(true)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>

              {/* Gas Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Speed
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["slow", "normal", "fast"].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setGasOption(speed)}
                      className={`p-3 rounded-lg border text-center capitalize
                        ${
                          gasOption === speed
                            ? "bg-purple-50 border-purple-200 text-purple-700"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      {speed}
                      <div className="text-sm text-gray-500">
                        {speed === "slow"
                          ? "~15 gwei"
                          : speed === "normal"
                          ? "~20 gwei"
                          : "~25 gwei"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={
                  !isConnected || !selectedToken || !amount || !recipient
                }
                className="w-full py-4 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                {!isConnected ? "Connect Wallet" : "Send Tokens"}
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {tx.status === "confirmed" ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Clock size={20} className="text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        Sent {tx.amount} {tx.token}
                      </div>
                      <div className="text-sm text-gray-500">To: {tx.to}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{tx.timestamp}</div>
                    <button
                      onClick={() => copyToClipboard(tx.hash)}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      {tx.hash}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Address Book and Token Balances */}
        <div className="space-y-6">
          {/* Token Balances */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Token Balances</h3>
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.icon}</span>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{token.balance}</div>
                    <div className="text-sm text-gray-500">{token.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Book */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Address Book</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User size={20} />
              </button>
            </div>

            {/* Recent Addresses */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Recent</h4>
              <div className="space-y-2">
                {recentAddresses.map((addr) => (
                  <button
                    key={addr.address}
                    onClick={() => setRecipient(addr.address)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-left">{addr.name}</div>
                      <div className="text-sm text-gray-500">
                        {addr.address}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{addr.lastUsed}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Addresses */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">Saved</h4>
              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.address}
                    onClick={() => setRecipient(addr.address)}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-left">{addr.name}</div>
                      <div className="text-sm text-gray-500">
                        {addr.address}
                      </div>
                      <div className="text-sm text-gray-500">{addr.notes}</div>
                    </div>
                    <Copy size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPage;
