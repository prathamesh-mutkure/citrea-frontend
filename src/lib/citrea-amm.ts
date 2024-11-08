import { ethers, BigNumber, ContractTransaction } from "ethers";
import { Provider } from "@ethersproject/providers";

export interface AMMConfig {
  provider: Provider;
  signer?: ethers.Signer;
  ammAddress: string;
  usdcAddress: string;
}

export interface ReservesData {
  cbtcReserve: string;
  usdcReserve: string;
}

export interface LiquidityPosition {
  shares: string;
  cbtcAmount: string;
  usdcAmount: string;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: any;
}

export class CitreaAMMWrapper {
  private provider: Provider;
  private signer: ethers.Signer;
  private ammContract: ethers.Contract;
  private usdcContract: ethers.Contract;
  private readonly ammAddress: string;
  private readonly usdcAddress: string;

  constructor(config: AMMConfig) {
    this.provider = config.provider;
    this.signer = config.signer || config.provider.getSigner();
    this.ammAddress = config.ammAddress;
    this.usdcAddress = config.usdcAddress;

    // ABI includes only the functions we need
    const ammAbi = [
      // View functions
      "function getReserves() external view returns (uint256 cbtcReserve, uint256 usdcReserve)",
      "function balanceOf(address account) external view returns (uint256)",
      "function totalSupply() external view returns (uint256)",
      // State changing functions
      "function addLiquidity(uint256 usdcAmount) external payable returns (uint256)",
      "function removeLiquidity(uint256 shares) external returns (uint256 cbtcAmount, uint256 usdcAmount)",
      "function swapExactCBTCForUSDC(uint256 minUsdcOut) external payable returns (uint256)",
      "function swapExactUSDCForCBTC(uint256 usdcAmount, uint256 minCbtcOut) external returns (uint256)",
      // Events
      "event LiquidityAdded(address indexed provider, uint256 cbtcAmount, uint256 usdcAmount, uint256 shares)",
      "event LiquidityRemoved(address indexed provider, uint256 cbtcAmount, uint256 usdcAmount, uint256 shares)",
      "event Swap(address indexed user, uint256 cbtcAmount, uint256 usdcAmount, bool cbtcToUsdc)",
    ];

    const erc20Abi = [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)",
    ];

    this.ammContract = new ethers.Contract(
      this.ammAddress,
      ammAbi,
      this.signer
    );
    this.usdcContract = new ethers.Contract(
      this.usdcAddress,
      erc20Abi,
      this.signer
    );
  }

  private async handleTransaction(
    transactionPromise: Promise<ContractTransaction>
  ): Promise<TransactionResult> {
    try {
      const tx = await transactionPromise;
      const receipt = await tx.wait();
      return {
        success: true,
        hash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Transaction failed:", error);
      return {
        success: false,
        error,
      };
    }
  }

  // Format amounts properly
  private formatCBTC(amount: string | number): BigNumber {
    return ethers.utils.parseEther(amount.toString());
  }

  private formatUSDC(amount: string | number): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), 6);
  }

  // View Functions
  async getReserves(): Promise<ReservesData> {
    const [cbtcReserve, usdcReserve] = await this.ammContract.getReserves();
    return {
      cbtcReserve: ethers.utils.formatEther(cbtcReserve),
      usdcReserve: ethers.utils.formatUnits(usdcReserve, 6),
    };
  }

  async getLiquidityPosition(address: string): Promise<LiquidityPosition> {
    const shares = await this.ammContract.balanceOf(address);
    const totalSupply = await this.ammContract.totalSupply();
    const reserves = await this.getReserves();

    if (totalSupply.isZero()) {
      return {
        shares: "0",
        cbtcAmount: "0",
        usdcAmount: "0",
      };
    }

    const cbtcAmount = this.formatCBTC(reserves.cbtcReserve)
      .mul(shares)
      .div(totalSupply);
    const usdcAmount = this.formatUSDC(reserves.usdcReserve)
      .mul(shares)
      .div(totalSupply);

    return {
      shares: ethers.utils.formatEther(shares),
      cbtcAmount: ethers.utils.formatEther(cbtcAmount),
      usdcAmount: ethers.utils.formatUnits(usdcAmount, 6),
    };
  }

  async getUSDCAllowance(owner: string): Promise<string> {
    const allowance = await this.usdcContract.allowance(owner, this.ammAddress);
    return ethers.utils.formatUnits(allowance, 6);
  }

  async checkUSDCApproval(
    owner: string,
    amount: string | number
  ): Promise<boolean> {
    const allowance = await this.usdcContract.allowance(owner, this.ammAddress);
    const requiredAmount = this.formatUSDC(amount);
    return allowance.gte(requiredAmount);
  }

  // State Changing Functions
  async approveUSDC(amount: string | number): Promise<TransactionResult> {
    const formattedAmount = this.formatUSDC(amount);
    return this.handleTransaction(
      this.usdcContract.approve(this.ammAddress, formattedAmount)
    );
  }

  async addLiquidity(
    cbtcAmount: string | number,
    usdcAmount: string | number
  ): Promise<TransactionResult> {
    const formattedUSDC = this.formatUSDC(usdcAmount);
    const formattedCBTC = this.formatCBTC(cbtcAmount);

    // First check and approve USDC if needed
    const userAddress = await this.signer.getAddress();
    const hasApproval = await this.checkUSDCApproval(userAddress, usdcAmount);

    if (!hasApproval) {
      const approvalResult = await this.approveUSDC(usdcAmount);
      if (!approvalResult.success) {
        return approvalResult;
      }
    }

    return this.handleTransaction(
      this.ammContract.addLiquidity(formattedUSDC, {
        value: formattedCBTC,
      })
    );
  }

  async removeLiquidity(shares: string | number): Promise<TransactionResult> {
    const formattedShares = this.formatCBTC(shares);
    return this.handleTransaction(
      this.ammContract.removeLiquidity(formattedShares)
    );
  }

  async swapCBTCForUSDC(
    cbtcAmount: string | number,
    minUsdcOut: string | number
  ): Promise<TransactionResult> {
    const formattedCBTC = this.formatCBTC(cbtcAmount);
    const formattedMinUSDC = this.formatUSDC(minUsdcOut);

    return this.handleTransaction(
      this.ammContract.swapExactCBTCForUSDC(formattedMinUSDC, {
        value: formattedCBTC,
      })
    );
  }

  async swapUSDCForCBTC(
    usdcAmount: string | number,
    minCbtcOut: string | number
  ): Promise<TransactionResult> {
    const formattedUSDC = this.formatUSDC(usdcAmount);
    const formattedMinCBTC = this.formatCBTC(minCbtcOut);

    // Check and approve USDC if needed
    const userAddress = await this.signer.getAddress();
    const hasApproval = await this.checkUSDCApproval(userAddress, usdcAmount);

    if (!hasApproval) {
      const approvalResult = await this.approveUSDC(usdcAmount);
      if (!approvalResult.success) {
        return approvalResult;
      }
    }

    return this.handleTransaction(
      this.ammContract.swapExactUSDCForCBTC(formattedUSDC, formattedMinCBTC)
    );
  }
}

// Usage Example:
const initializeAMM = async () => {
  // With MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request account access

  const ammWrapper = new CitreaAMMWrapper({
    provider,
    ammAddress: "YOUR_AMM_CONTRACT_ADDRESS",
    usdcAddress: "0xb669dC8cC6D044307Ba45366C0c836eC3c7e31AA",
  });

  return ammWrapper;
};

// Example usage:
/*
const main = async () => {
    const amm = await initializeAMM();
    
    // Get reserves
    const reserves = await amm.getReserves();
    console.log('Pool Reserves:', reserves);

    // Add liquidity
    const addLiquidityResult = await amm.addLiquidity('0.1', '100');
    if (addLiquidityResult.success) {
        console.log('Liquidity added successfully!');
    }

    // Swap CBTC for USDC
    const swapResult = await amm.swapCBTCForUSDC('0.01', '95');
    if (swapResult.success) {
        console.log('Swap completed successfully!');
    }
};
*/
