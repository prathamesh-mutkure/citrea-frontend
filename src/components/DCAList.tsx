"use client";

import { useWallet } from "@/lib/hooks/useWallet"; // Your wallet hook
import { useDCA, DCAInfo } from "@/hooks/useDCA";
import { useCallback } from "react";
import { formatEther, formatUnits } from "ethers";

export default function DCAListPage() {
  const { account } = useWallet();
  const { dcaList, loading, error, executeDCA, refreshList } = useDCA(account);

  const formatTimeLeft = useCallback((nextExecutionTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const diff = nextExecutionTime - now;

    if (diff <= 0n) return "Ready to execute";

    const hours = Number(diff / 3600n);
    const minutes = Number((diff % 3600n) / 60n);
    return `${hours}h ${minutes}m`;
  }, []);

  if (loading) return <div>Loading your DCA strategies...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!account) return <div>Please connect your wallet</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your DCA Strategies</h1>

      <div className="grid gap-4">
        {dcaList.map((dca: DCAInfo) => {
          console.log(dca);

          return (
            <div
              key={dca.dcaContract}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    DCA Strategy #{dca.dcaContract?.slice(0, 6)}...
                  </h2>
                  <p className="text-sm text-gray-600">
                    Amount: {formatEther(dca.dcaAmount)} tokens
                  </p>
                  <p className="text-sm text-gray-600">
                    Interval: {formatUnits(dca.dcaInterval, 0)} seconds
                  </p>
                  {dca.nextExecutionTime && (
                    <p className="text-sm text-gray-600">
                      Next execution: {formatTimeLeft(dca.nextExecutionTime)}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {dca.isActive ? (
                    <button
                      onClick={() => executeDCA(dca.dcaContract)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      disabled={
                        dca.nextExecutionTime
                          ? dca.nextExecutionTime >
                            BigInt(Math.floor(Date.now() / 1000))
                          : true
                      }
                    >
                      Execute DCA
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {dcaList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No DCA strategies found. Create one to get started!
          </div>
        )}
      </div>

      <button
        onClick={refreshList}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        Refresh List
      </button>
    </div>
  );
}
