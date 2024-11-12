// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "contracts/eth_dca.sol";

interface IDCAStrategy {
    function executeDCA() external;
    function stablecoinAmount() external view returns (uint);
    function owner() external view returns (address);
}

contract DCAFactory is Ownable(msg.sender), ReentrancyGuard {
    // State variables
    struct DCAInfo {
        address dcaContract;
        address owner;
        address stablecoin;
        uint dcaAmount;
        uint dcaInterval;
        bool isActive;
    }

    mapping(address => DCAInfo[]) public userDCAs;
    mapping(address => bool) public authorizedExecutors;
    address[] public allDCAs;

    // Events
    event DCACreated(
        address indexed owner,
        address indexed dcaContract,
        address stablecoin,
        uint dcaAmount,
        uint dcaInterval
    );
    event DCADeactivated(address indexed owner, address indexed dcaContract);
    event ExecutorAuthorized(address indexed executor, bool authorized);

    constructor() {}

    // Create new DCA strategy
    function createDCA(
        address _router,
        address _stablecoin,
        uint _dcaAmount,
        uint _dcaInterval,
        uint _slippageTolerance
    ) external returns (address) {
        // Deploy new DCA contract
        DCAStrategy newDCA = new DCAStrategy(
            _router,
            _stablecoin,
            _dcaAmount,
            _dcaInterval,
            _slippageTolerance
        );

        // Transfer ownership to the user
        newDCA.transferOwnership(msg.sender);

        // Store DCA information
        DCAInfo memory dcaInfo = DCAInfo({
            dcaContract: address(newDCA),
            owner: msg.sender,
            stablecoin: _stablecoin,
            dcaAmount: _dcaAmount,
            dcaInterval: _dcaInterval,
            isActive: true
        });

        userDCAs[msg.sender].push(dcaInfo);
        allDCAs.push(address(newDCA));

        emit DCACreated(
            msg.sender,
            address(newDCA),
            _stablecoin,
            _dcaAmount,
            _dcaInterval
        );

        return address(newDCA);
    }

    // Deactivate DCA strategy
    function deactivateDCA(address _dcaContract) external {
        DCAInfo[] storage dcas = userDCAs[msg.sender];
        for (uint i = 0; i < dcas.length; i++) {
            if (
                dcas[i].dcaContract == _dcaContract &&
                dcas[i].owner == msg.sender
            ) {
                dcas[i].isActive = false;
                emit DCADeactivated(msg.sender, _dcaContract);
                return;
            }
        }
        revert("DCA not found or not owner");
    }

    // Authorize/deauthorize executor (only owner)
    function setExecutorAuthorization(
        address _executor,
        bool _authorized
    ) external onlyOwner {
        authorizedExecutors[_executor] = _authorized;
        emit ExecutorAuthorized(_executor, _authorized);
    }

    // Execute DCA for a specific contract (only authorized executors)
    function executeDCA(address _dcaContract) external {
        require(authorizedExecutors[msg.sender], "Not authorized executor");

        // Check if DCA is active
        bool isActive = false;
        address owner;

        for (uint i = 0; i < allDCAs.length; i++) {
            if (allDCAs[i] == _dcaContract) {
                DCAInfo[] memory dcas = userDCAs[
                    IDCAStrategy(_dcaContract).owner()
                ];
                for (uint j = 0; j < dcas.length; j++) {
                    if (dcas[j].dcaContract == _dcaContract) {
                        isActive = dcas[j].isActive;
                        owner = dcas[j].owner;
                        break;
                    }
                }
                break;
            }
        }

        require(isActive, "DCA is not active");

        // Execute DCA
        IDCAStrategy(_dcaContract).executeDCA();
    }

    // View functions
    function getUserDCAs(
        address _user
    ) external view returns (DCAInfo[] memory) {
        return userDCAs[_user];
    }

    function getAllDCAs() external view returns (address[] memory) {
        return allDCAs;
    }

    function getActiveDCAs() external view returns (address[] memory) {
        uint activeCount = 0;

        // Count active DCAs
        for (uint i = 0; i < allDCAs.length; i++) {
            address owner = IDCAStrategy(allDCAs[i]).owner();
            DCAInfo[] memory dcas = userDCAs[owner];
            for (uint j = 0; j < dcas.length; j++) {
                if (dcas[j].dcaContract == allDCAs[i] && dcas[j].isActive) {
                    activeCount++;
                    break;
                }
            }
        }

        // Create array of active DCAs
        address[] memory activeDCAs = new address[](activeCount);
        uint currentIndex = 0;

        for (uint i = 0; i < allDCAs.length; i++) {
            address owner = IDCAStrategy(allDCAs[i]).owner();
            DCAInfo[] memory dcas = userDCAs[owner];
            for (uint j = 0; j < dcas.length; j++) {
                if (dcas[j].dcaContract == allDCAs[i] && dcas[j].isActive) {
                    activeDCAs[currentIndex] = allDCAs[i];
                    currentIndex++;
                    break;
                }
            }
        }

        return activeDCAs;
    }
}
