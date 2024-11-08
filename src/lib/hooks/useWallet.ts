"use client";

import { useState, useEffect, useCallback } from "react";

interface WalletState {
  isConnected: boolean;
  account: string;
  balance: string;
  error: string;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    account: "",
    balance: "0.00",
    error: "",
  });

  const updateBalance = useCallback(async (address: string) => {
    try {
      if (!window.ethereum) return;
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const ethBalance = (parseInt(balance as string, 16) / 1e18).toFixed(4);
      setState((prev) => ({ ...prev, balance: ethBalance }));
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  }, []);

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length === 0) {
        setState((prev) => ({
          ...prev,
          isConnected: false,
          account: "",
          balance: "0.00",
        }));
      } else {
        const account = accounts[0];
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account,
        }));
        await updateBalance(account);
      }
    },
    [updateBalance]
  );

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setState((prev) => ({ ...prev, error: "Please install MetaMask!" }));
        return;
      }

      setState((prev) => ({ ...prev, error: "" }));
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      await handleAccountsChanged(accounts as string[]);
    } catch (error: any) {
      if (error.code === 4001) {
        setState((prev) => ({ ...prev, error: "Please connect to MetaMask." }));
      } else {
        setState((prev) => ({ ...prev, error: "Error connecting to wallet" }));
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!window.ethereum) {
          setState((prev) => ({ ...prev, error: "Please install MetaMask!" }));
          return;
        }

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          await handleAccountsChanged(accounts as string[]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setState((prev) => ({ ...prev, error: "Error connecting to wallet" }));
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [handleAccountsChanged]);

  return {
    ...state,
    connectWallet,
  };
};
