import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  DCA_FACTORY_ABI,
  DCA_FACTORY_ADDRESS,
  DCA_STRATEGY_ABI,
} from "@/lib/contracts";

export interface DCAInfo {
  dcaContract: string;
  owner: string;
  stablecoin: string;
  dcaAmount: bigint;
  dcaInterval: bigint;
  isActive: boolean;
  lastExecutionTime?: bigint;
  nextExecutionTime?: bigint;
}

export function useDCA(address: string | undefined) {
  const [dcaList, setDcaList] = useState<DCAInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDCAList = useCallback(async () => {
    if (!address || !window.ethereum) return;

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const factoryContract = new ethers.Contract(
        DCA_FACTORY_ADDRESS,
        DCA_FACTORY_ABI,
        signer
      );

      const rawDcaInfos = await factoryContract.getUserDCAs(address);

      // Convert the array response to DCAInfo objects
      const mappedDcaInfos = rawDcaInfos.map((info: any[]) => ({
        dcaContract: info[0],
        owner: info[1],
        stablecoin: info[2],
        dcaAmount: info[3],
        dcaInterval: info[4],
        isActive: info[5],
      }));

      // Fetch additional details for each DCA strategy
      const enhancedDcaInfos = await Promise.all(
        mappedDcaInfos.map(async (info: DCAInfo) => {
          const strategyContract = new ethers.Contract(
            info.dcaContract,
            DCA_STRATEGY_ABI,
            provider
          );

          try {
            const lastExecutionTime =
              await strategyContract.lastExecutionTime();
            const interval = await strategyContract.dcaInterval();

            return {
              ...info,
              lastExecutionTime,
              nextExecutionTime: lastExecutionTime + interval,
            };
          } catch (err) {
            console.error(
              `Error fetching details for DCA ${info.dcaContract}:`,
              err
            );
            return info; // Return basic info if additional details fetch fails
          }
        })
      );

      setDcaList(enhancedDcaInfos);
      setError(null);
    } catch (err) {
      console.error("Error loading DCA list:", err);
      setError("Failed to load DCA strategies");
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Create new DCA strategy
  const createDCA = async (
    router: string,
    stablecoin: string,
    dcaAmount: bigint,
    dcaInterval: bigint,
    slippageTolerance: bigint
  ) => {
    if (!window.ethereum) throw new Error("No wallet connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const factoryContract = new ethers.Contract(
        DCA_FACTORY_ADDRESS,
        DCA_FACTORY_ABI,
        signer
      );

      const tx = await factoryContract.createDCA(
        router,
        stablecoin,
        dcaAmount,
        dcaInterval,
        slippageTolerance
      );

      await tx.wait();
      await loadDCAList();
    } catch (err) {
      console.log(err);
    }
  };

  // Execute DCA for a specific strategy
  const executeDCA = async (dcaAddress: string) => {
    if (!window.ethereum) throw new Error("No wallet connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const strategyContract = new ethers.Contract(
        dcaAddress,
        DCA_STRATEGY_ABI,
        signer
      );

      const tx = await strategyContract.executeDCA();
      await tx.wait();
      await loadDCAList();
    } catch (err: any) {
      console.error("Error executing DCA:", err);
      throw new Error(err.reason || "Failed to execute DCA");
    }
  };

  // Withdraw ETH from DCA strategy
  const withdrawETH = async (dcaAddress: string) => {
    if (!window.ethereum) throw new Error("No wallet connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const strategyContract = new ethers.Contract(
        dcaAddress,
        DCA_STRATEGY_ABI,
        signer
      );

      const tx = await strategyContract.withdrawETH();
      await tx.wait();
    } catch (err: any) {
      console.error("Error withdrawing ETH:", err);
      throw new Error(err.reason || "Failed to withdraw ETH");
    }
  };

  // Withdraw stablecoin from DCA strategy
  const withdrawStablecoin = async (dcaAddress: string, amount: bigint) => {
    if (!window.ethereum) throw new Error("No wallet connected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const strategyContract = new ethers.Contract(
        dcaAddress,
        DCA_STRATEGY_ABI,
        signer
      );

      const tx = await strategyContract.withdrawStablecoin(amount);
      await tx.wait();
      await loadDCAList();
    } catch (err: any) {
      console.error("Error withdrawing stablecoin:", err);
      throw new Error(err.reason || "Failed to withdraw stablecoin");
    }
  };

  useEffect(() => {
    loadDCAList();
  }, [loadDCAList]);

  return {
    dcaList,
    loading,
    error,
    createDCA,
    executeDCA,
    withdrawETH,
    withdrawStablecoin,
    refreshList: loadDCAList,
  };
}
