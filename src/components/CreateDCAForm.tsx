"use client";

import { useState } from "react";

import { UniswapV2Router02, USDC_CONTRACT_ADDRESS } from "@/lib/constant";
import { useDCA } from "@/hooks/useDCA";
import { useWallet } from "@/lib/hooks/useWallet";

export default function CreateDCAForm() {
  const { account } = useWallet();
  const { createDCA, error } = useDCA(account);
  const [amount, setAmount] = useState("");
  const [interval, setInterval] = useState("");
  const [slippage, setSlippage] = useState("1"); // 1% default
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert to proper units (assuming 6 decimals for USDC)
      const dcaAmount = BigInt(parseFloat(amount) * 1_000_000);
      const dcaInterval = BigInt(parseInt(interval) * 86400); // Convert days to seconds
      const slippageBPS = BigInt(parseFloat(slippage) * 100); // Convert percentage to basis points

      setIsLoading(true);
      await createDCA(
        UniswapV2Router02,
        USDC_CONTRACT_ADDRESS,
        dcaAmount,
        dcaInterval,
        slippageBPS
      );

      // Handle success (e.g., show toast, reset form)

      console.log("DCA Created");
    } catch (err) {
      // Handle error
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Amount (USDC)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.000001"
          required
        />
      </div>

      <div>
        <label>Interval (days)</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          min="1"
          required
        />
      </div>

      <div>
        <label>Slippage Tolerance (%)</label>
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          min="0.1"
          max="10"
          step="0.1"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isLoading ? "Creating..." : "Create DCA"}
      </button>

      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}
