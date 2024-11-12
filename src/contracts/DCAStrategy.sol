// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function WETH() external pure returns (address);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

contract DCAStrategy is Ownable(msg.sender), ReentrancyGuard {
    // State variables
    IUniswapV2Router02 public immutable uniswapRouter;
    IERC20 public immutable stablecoin;
    uint public dcaAmount;
    uint public dcaInterval;
    uint public lastExecutionTime;
    uint public slippageTolerance; // in basis points (1/100 of 1%)

    // Events
    event DCAExecuted(uint amountIn, uint amountOut, uint timestamp);
    event DCAConfigUpdated(uint newAmount, uint newInterval);
    event SlippageToleranceUpdated(uint newTolerance);

    constructor(
        address _router,
        address _stablecoin,
        uint _dcaAmount,
        uint _dcaInterval,
        uint _slippageTolerance
    ) {
        require(_router != address(0), "Invalid router address");
        require(_stablecoin != address(0), "Invalid stablecoin address");
        require(_dcaAmount > 0, "Invalid DCA amount");
        require(_dcaInterval > 0, "Invalid DCA interval");
        require(_slippageTolerance <= 1000, "Slippage tolerance too high"); // max 10%

        uniswapRouter = IUniswapV2Router02(_router);
        stablecoin = IERC20(_stablecoin);
        dcaAmount = _dcaAmount;
        dcaInterval = _dcaInterval;
        slippageTolerance = _slippageTolerance;
        lastExecutionTime = block.timestamp;
    }

    // Execute DCA purchase
    function executeDCA() external nonReentrant {
        require(
            block.timestamp >= lastExecutionTime + dcaInterval,
            "Too early for next DCA"
        );
        require(
            stablecoin.balanceOf(address(this)) >= dcaAmount,
            "Insufficient stablecoin balance"
        );

        // Prepare swap parameters
        address[] memory path = new address[](2);
        path[0] = address(stablecoin);
        path[1] = uniswapRouter.WETH();

        // Calculate minimum amount out based on slippage tolerance
        uint[] memory amounts = uniswapRouter.getAmountsOut(dcaAmount, path);
        uint minAmountOut = (amounts[1] * (10000 - slippageTolerance)) / 10000;

        // Approve router to spend stablecoin
        stablecoin.approve(address(uniswapRouter), dcaAmount);

        // Execute swap
        uint[] memory received = uniswapRouter.swapExactTokensForETH(
            dcaAmount,
            minAmountOut,
            path,
            address(this),
            block.timestamp + 300 // 5 minute deadline
        );

        // TODO: Get return token amount and send to DCA owner

        lastExecutionTime = block.timestamp;

        emit DCAExecuted(dcaAmount, received[1], block.timestamp);
    }

    // Update DCA configuration
    function updateDCAConfig(
        uint _newAmount,
        uint _newInterval
    ) external onlyOwner {
        require(_newAmount > 0, "Invalid DCA amount");
        require(_newInterval > 0, "Invalid DCA interval");

        dcaAmount = _newAmount;
        dcaInterval = _newInterval;

        emit DCAConfigUpdated(_newAmount, _newInterval);
    }

    // Update slippage tolerance
    function updateSlippageTolerance(uint _newTolerance) external onlyOwner {
        require(_newTolerance <= 1000, "Slippage tolerance too high"); // max 10%
        slippageTolerance = _newTolerance;
        emit SlippageToleranceUpdated(_newTolerance);
    }

    // Withdraw ETH (for owner)
    function withdrawETH() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }

    // Withdraw stablecoins (for owner)
    function withdrawStablecoin(uint amount) external onlyOwner {
        require(
            amount <= stablecoin.balanceOf(address(this)),
            "Insufficient balance"
        );
        stablecoin.transfer(owner(), amount);
    }

    function stablecoinAmount() external view returns (uint) {
        return stablecoin.balanceOf(address(this));
    }

    // Required to receive ETH from Uniswap swaps
    receive() external payable {}
}
