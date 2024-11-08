"use client";

import React, { useState } from "react";
import { ArrowDownUp, Settings, Info, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const priceData = [
  { time: "12:00", price: 1800 },
  { time: "13:00", price: 1820 },
  { time: "14:00", price: 1790 },
  { time: "15:00", price: 1850 },
  { time: "16:00", price: 1830 },
  { time: "17:00", price: 1860 },
  { time: "18:00", price: 1880 },
];

const pools = [
  {
    pair: "ETH/USDC",
    tvl: "$5.2M",
    volume24h: "$1.2M",
    fees24h: "$3.6K",
    apr: "12.5%",
    token0: { symbol: "ETH", balance: "1,420.5", value: "$2.6M" },
    token1: { symbol: "USDC", balance: "2.6M", value: "$2.6M" },
  },
  {
    pair: "BTC/USDC",
    tvl: "$8.5M",
    volume24h: "$2.5M",
    fees24h: "$7.5K",
    apr: "15.2%",
    token0: { symbol: "BTC", balance: "65.8", value: "$4.25M" },
    token1: { symbol: "USDC", balance: "4.25M", value: "$4.25M" },
  },
];

const AMMPage = () => {
  const [activeTab, setActiveTab] = useState("swap");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [token0, setToken0] = useState("ETH");
  const [token1, setToken1] = useState("USDC");
  const [slippage, setSlippage] = useState("0.5");
  const [isConnected, setIsConnected] = useState(false);

  const handleSwap = () => {
    if (!isConnected) return;
    console.log("Executing swap...");
  };

  const handleAddLiquidity = () => {
    if (!isConnected) return;
    console.log("Adding liquidity...");
  };

  const TokenInput = ({
    value,
    onChange,
    defaultToken,
    onTokenSelect,
    label,
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm text-gray-500">Balance: 0.00</span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="bg-transparent text-2xl outline-none w-full"
        />
        <button className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border hover:bg-gray-50">
          <span>{defaultToken}</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm">Price: ${payload[0].value}</p>
          <p className="text-sm text-gray-500">{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "swap"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("swap")}
        >
          Swap
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "pool"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("pool")}
        >
          Liquidity
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Swap/Pool Interface */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === "swap" ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Swap</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Settings size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <TokenInput
                  value={amount0}
                  onChange={setAmount0}
                  defaultToken={token0}
                  onTokenSelect={setToken0}
                  label="You pay"
                />

                <div className="flex justify-center -my-2">
                  <button
                    className="bg-white border rounded-full p-2 hover:bg-gray-50"
                    onClick={() => {
                      const tempAmount = amount0;
                      const tempToken = token0;
                      setAmount0(amount1);
                      setToken0(token1);
                      setAmount1(tempAmount);
                      setToken1(tempToken);
                    }}
                  >
                    <ArrowDownUp size={20} />
                  </button>
                </div>

                <TokenInput
                  value={amount1}
                  onChange={setAmount1}
                  defaultToken={token1}
                  onTokenSelect={setToken1}
                  label="You receive"
                />

                {amount0 && amount1 && (
                  <div className="space-y-2 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Rate</span>
                      <span>
                        1 {token0} = 1,845.20 {token1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Price Impact
                        <Info size={14} className="text-gray-400" />
                      </span>
                      <span className="text-green-600">0.05%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum received</span>
                      <span>
                        {(amount1 * 0.995).toFixed(4)} {token1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Fee</span>
                      <span>~$5.00</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSwap}
                  disabled={!isConnected || !amount0 || !amount1}
                  className="w-full py-4 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                  {!isConnected ? "Connect Wallet" : "Swap"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add Liquidity</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Settings size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <TokenInput
                  value={amount0}
                  onChange={setAmount0}
                  defaultToken={token0}
                  onTokenSelect={setToken0}
                  label="Token 1"
                />
                <TokenInput
                  value={amount1}
                  onChange={setAmount1}
                  defaultToken={token1}
                  onTokenSelect={setToken1}
                  label="Token 2"
                />

                {amount0 && amount1 && (
                  <div className="space-y-2 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Pool Share</span>
                      <span>0.05%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Pool Rate</span>
                      <span>
                        1 {token0} = 1,845.20 {token1}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddLiquidity}
                  disabled={!isConnected || !amount0 || !amount1}
                  className="w-full py-4 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                  {!isConnected ? "Connect Wallet" : "Add Liquidity"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pool Info & Charts */}
        <div className="space-y-6">
          {/* Price Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Price Chart</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <XAxis dataKey="time" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pool Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Pool Statistics</h3>
            <div className="space-y-4">
              {pools.map((pool) => (
                <div key={pool.pair} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">{pool.pair}</span>
                    <span className="text-purple-600">{pool.apr} APR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">TVL</div>
                      <div className="font-medium">{pool.tvl}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">24h Volume</div>
                      <div className="font-medium">{pool.volume24h}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">24h Fees</div>
                      <div className="font-medium">{pool.fees24h}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pool Ratio</div>
                      <div className="font-medium">50/50</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMMPage;
