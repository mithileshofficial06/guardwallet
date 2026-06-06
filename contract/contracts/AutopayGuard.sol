// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract AutopayGuard is AutomationCompatibleInterface {
    IERC20 public usdc;
    
    struct AutoPay {
        address recipient;
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastPaid;
        bool isActive;
    }
    
    mapping(address => mapping(uint256 => AutoPay)) public autopays;
    mapping(address => uint256) public autopayCount;
    mapping(address => uint256) public balances;
    
    event AutoPayCreated(address indexed user, uint256 indexed id, address recipient, uint256 amount);
    event AutoPayExecuted(address indexed user, uint256 indexed id, uint256 amount);
    event AutoPayCancelled(address indexed user, uint256 indexed id);
    
    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }
    
    function createAutoPay(
        address recipient,
        uint256 amount,
        uint256 frequency
    ) external returns(uint256) {
        uint256 id = autopayCount[msg.sender]++;
        
        autopays[msg.sender][id] = AutoPay({
            recipient: recipient,
            amount: amount,
            frequency: frequency,
            lastPaid: block.timestamp,
            isActive: true
        });
        
        emit AutoPayCreated(msg.sender, id, recipient, amount);
        return id;
    }
    
    function deposit(uint256 amount) external {
        usdc.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }
    
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        // Check all users for due autopays - simplified for demo
        // In production, use indexed approach
        upkeepNeeded = false;
        performData = "";
    }
    
    function performUpkeep(bytes calldata performData) external override {
        // Chainlink automation executes payments
        (address user, uint256 id) = abi.decode(performData, (address, uint256));
        _executeAutoPay(user, id);
    }
    
    function _executeAutoPay(address user, uint256 id) internal {
        AutoPay storage autopay = autopays[user][id];
        
        require(autopay.isActive, "Not active");
        require(block.timestamp >= autopay.lastPaid + autopay.frequency, "Too soon");
        require(balances[user] >= autopay.amount, "Insufficient balance");
        
        balances[user] -= autopay.amount;
        autopay.lastPaid = block.timestamp;
        
        usdc.transfer(autopay.recipient, autopay.amount);
        
        emit AutoPayExecuted(user, id, autopay.amount);
    }
    
    function cancelAutoPay(uint256 id) external {
        autopays[msg.sender][id].isActive = false;
        emit AutoPayCancelled(msg.sender, id);
    }
    
    function getAutoPay(address user, uint256 id) external view returns(
        address recipient,
        uint256 amount,
        uint256 frequency,
        uint256 lastPaid,
        bool isActive
    ) {
        AutoPay storage autopay = autopays[user][id];
        return (
            autopay.recipient,
            autopay.amount,
            autopay.frequency,
            autopay.lastPaid,
            autopay.isActive
        );
    }
}
