"use client";

import React, { useState } from "react";
import { ArrowUpDown, Info, Settings } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const stablecoins = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,000.00",
    price: 1.0,
    icon: "💵",
  },
  { symbol: "USDT", name: "Tether", balance: "500.00", price: 1.0, icon: "💵" },
  { symbol: "DAI", name: "Dai", balance: "750.00", price: 1.0, icon: "💵" },
  {
    symbol: "USDB",
    name: "USD Base",
    balance: "250.00",
    price: 1.0,
    icon: "💵",
  },
];

const SwapPage = () => {
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [isConnected, setIsConnected] = useState(false);

  const handleSwap = () => {
    if (!isConnected) {
      return;
    }
    // Implement swap logic here
  };

  const calculateRate = () => {
    // In real app, this would fetch actual rates
    return "1.0000";
  };

  const calculateImpact = () => {
    // In real app, this would calculate actual price impact
    return "0.01";
  };

  const TokenSelect = ({ value, onChange, tokens }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border rounded-lg p-2 min-w-[180px]"
    >
      <option value="">Select token</option>
      {tokens.map((coin) => (
        <option key={coin.symbol} value={coin.symbol}>
          {coin.icon} {coin.symbol}
        </option>
      ))}
    </select>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid gap-6">
        {/* Swap Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Swap Stablecoins</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={20} />
            </button>
          </div>

          {/* Swap Interface */}
          <div className="space-y-4">
            {/* From Token */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">From</span>
                <span className="text-sm text-gray-500">
                  Balance:{" "}
                  {stablecoins.find((c) => c.symbol === fromToken)?.balance ||
                    "0.00"}
                </span>
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-2xl outline-none w-full"
                />
                <TokenSelect
                  value={fromToken}
                  onChange={setFromToken}
                  tokens={stablecoins}
                />
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center -my-2">
              <button
                className="bg-white border rounded-full p-2 hover:bg-gray-50"
                onClick={() => {
                  const temp = fromToken;
                  setFromToken(toToken);
                  setToToken(temp);
                }}
              >
                <ArrowUpDown size={20} />
              </button>
            </div>

            {/* To Token */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">To</span>
                <span className="text-sm text-gray-500">
                  Balance:{" "}
                  {stablecoins.find((c) => c.symbol === toToken)?.balance ||
                    "0.00"}
                </span>
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={amount}
                  readOnly
                  placeholder="0.00"
                  className="bg-transparent text-2xl outline-none w-full"
                />
                <TokenSelect
                  value={toToken}
                  onChange={setToToken}
                  tokens={stablecoins}
                />
              </div>
            </div>

            {/* Swap Details */}
            {fromToken && toToken && amount && (
              <div className="space-y-2 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span>
                    1 {fromToken} = {calculateRate()} {toToken}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Slippage Tolerance
                    <Info size={14} className="text-gray-400" />
                  </span>
                  <span>{slippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Impact</span>
                  <span className="text-green-600">{calculateImpact()}%</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSwap}
              disabled={!isConnected || !fromToken || !toToken || !amount}
              className="w-full py-4 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              {!isConnected ? "Connect Wallet" : "Swap"}
            </button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Token</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">24h Volume</th>
                  <th className="text-left p-4">Liquidity</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stablecoins.map((coin) => (
                  <tr key={coin.symbol} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{coin.icon}</span>
                        <div>
                          <div className="font-medium">{coin.symbol}</div>
                          <div className="text-sm text-gray-500">
                            {coin.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">${coin.price.toFixed(2)}</td>
                    <td className="p-4">$2.5M</td>
                    <td className="p-4">$10M</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setFromToken(coin.symbol);
                          document
                            .getElementById("swap-section")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Swap
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
