"use client";

import React, { useState } from "react";
import {
  DollarSign,
  PlayCircle,
  PauseCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";

const tokens = [
  { symbol: "ETH", name: "Ethereum", price: 4200.0, icon: "⟠" },
  { symbol: "BTC", name: "Bitcoin", price: 65000.0, icon: "₿" },
  { symbol: "USDC", name: "USD Coin", price: 1.0, icon: "💵" },
  { symbol: "USDT", name: "Tether", price: 1.0, icon: "💵" },
];

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const DCAPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Sample DCA positions
  const [dcaPositions, setDcaPositions] = useState([
    {
      id: 1,
      from: "USDC",
      to: "ETH",
      amount: "100",
      frequency: "weekly",
      nextExecution: "2024-11-15",
      totalInvested: "1200",
      active: true,
    },
    {
      id: 2,
      from: "USDT",
      to: "BTC",
      amount: "500",
      frequency: "monthly",
      nextExecution: "2024-12-01",
      totalInvested: "2000",
      active: false,
    },
  ]);

  const handleCreateDCA = () => {
    // Implementation for creating new DCA position
    console.log("Creating DCA position...");
  };

  const toggleDCA = (id) => {
    setDcaPositions((positions) =>
      positions.map((pos) =>
        pos.id === id ? { ...pos, active: !pos.active } : pos
      )
    );
  };

  const deleteDCA = (id) => {
    setDcaPositions((positions) => positions.filter((pos) => pos.id !== id));
  };

  const TokenSelect = ({ value, onChange, tokens, excludeToken }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border rounded-lg p-2 w-full"
    >
      <option value="">Select token</option>
      {tokens
        .filter((token) => token.symbol !== excludeToken)
        .map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.icon} {token.symbol} - {token.name}
          </option>
        ))}
    </select>
  );

  return (
    <div className="max-w-6xl mr-auto">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "create"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create DCA Position
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "manage"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Positions
        </button>
      </div>

      {/* Create DCA Form */}
      {activeTab === "create" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Create DCA Position</h2>

          <div className="grid gap-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Investment Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={20} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10 w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Token Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  From Token
                </label>
                <TokenSelect
                  value={fromToken}
                  onChange={setFromToken}
                  tokens={tokens}
                  excludeToken={toToken}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  To Token
                </label>
                <TokenSelect
                  value={toToken}
                  onChange={setToToken}
                  tokens={tokens}
                  excludeToken={fromToken}
                />
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Investment Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select frequency</option>
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary */}
            {amount && fromToken && toToken && frequency && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Summary</h3>
                <div className="text-sm text-gray-600">
                  <p>
                    Invest ${amount} worth of {fromToken} into {toToken}{" "}
                    {frequency}
                  </p>
                  <p className="mt-2">
                    First execution will be on the next {frequency} interval
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleCreateDCA}
              disabled={
                !isConnected || !amount || !fromToken || !toToken || !frequency
              }
              className="w-full py-4 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              {!isConnected ? "Connect Wallet" : "Create DCA Position"}
            </button>
          </div>
        </div>
      )}

      {/* Manage DCA Positions */}
      {activeTab === "manage" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Active DCA Positions</h2>

          {dcaPositions.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No DCA positions found</p>
              <p className="text-sm mt-2">
                Create a new position to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dcaPositions.map((position) => (
                <div
                  key={position.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {position.from} → {position.to}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${position.amount} {position.frequency}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Total Invested
                        </div>
                        <div className="font-medium">
                          ${position.totalInvested}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Next Execution
                        </div>
                        <div className="font-medium">
                          {position.nextExecution}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleDCA(position.id)}
                          className={`p-2 rounded-full ${
                            position.active
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {position.active ? (
                            <PlayCircle size={20} />
                          ) : (
                            <PauseCircle size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => deleteDCA(position.id)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DCAPage;
