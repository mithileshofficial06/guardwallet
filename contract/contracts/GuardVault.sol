// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

/**
 * @title GuardVault
 * @notice Core autopay protection vault with social recovery and Aave yield
 * @dev Protects autopay funds in a multisig vault that earns yield until payment date
 */
contract GuardVault is ReentrancyGuard, Ownable {
    IERC20 public usdc;
    IPool public aavePool;
    
    uint256 public constant YIELD_FEE_PERCENT = 50; // 0.5% (50/10000)
    uint256 public constant BASIS_POINTS = 10000;
    
    struct Vault {
        uint256 protectedBalance;
        uint256 availableBalance;
        uint256 yieldEarned;
        uint256 totalYieldEarned;
        uint256 survivalMinimum;
        bool isActive;
        address[] trustedCircle;
        uint256 requiredApprovals;
        uint256 lastProtectionDate;
        uint256 successfulCycles;
    }
    
    struct AutopaySchedule {
        uint256 amount;
        uint256 nextPaymentDate;
        uint256 frequency; // in days
        address recipient;
        bool isActive;
    }
    
    mapping(address => Vault) public vaults;
    mapping(address => AutopaySchedule[]) public autopaySchedules;
    mapping(address => mapping(address => bool)) public isTrusted;
    mapping(bytes32 => mapping(address => bool)) public emergencyApprovals;
    mapping(bytes32 => uint256) public approvalCount;
    mapping(bytes32 => address) public requestOwner;
    
    event VaultCreated(address indexed user, uint256 survivalMinimum);
    event FundsProtected(address indexed user, uint256 amount, string reason);
    event EmergencyWithdrawal(address indexed user, uint256 amount, bytes32 requestId);
    event TrustedAdded(address indexed user, address indexed trusted);
    event YieldClaimed(address indexed user, uint256 amount, uint256 feeAmount);
    event AutopayScheduled(address indexed user, uint256 amount, uint256 nextPaymentDate);
    event DailyBudgetCalculated(address indexed user, uint256 dailyBudget, uint256 daysRemaining);
    event ProtectionCycleCompleted(address indexed user, uint256 cycleNumber);
    
    constructor(address _usdc, address _aavePool) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        aavePool = IPool(_aavePool);
    }
    
    function createVault(
        address[] memory _trustedCircle, 
        uint256 _requiredApprovals,
        uint256 _survivalMinimum
    ) external {
        require(!vaults[msg.sender].isActive, "Vault exists");
        require(_trustedCircle.length >= _requiredApprovals, "Invalid approvals");
        require(_survivalMinimum > 0, "Invalid survival minimum");
        
        Vault storage vault = vaults[msg.sender];
        vault.isActive = true;
        vault.trustedCircle = _trustedCircle;
        vault.requiredApprovals = _requiredApprovals;
        vault.survivalMinimum = _survivalMinimum;
        vault.lastProtectionDate = block.timestamp;
        
        for(uint i = 0; i < _trustedCircle.length; i++) {
            isTrusted[msg.sender][_trustedCircle[i]] = true;
        }
        
        emit VaultCreated(msg.sender, _survivalMinimum);
    }
    
    function addAutopaySchedule(
        uint256 amount,
        uint256 nextPaymentDate,
        uint256 frequencyInDays,
        address recipient
    ) external {
        require(vaults[msg.sender].isActive, "No vault");
        require(amount > 0, "Invalid amount");
        require(nextPaymentDate > block.timestamp, "Invalid date");
        
        autopaySchedules[msg.sender].push(AutopaySchedule({
            amount: amount,
            nextPaymentDate: nextPaymentDate,
            frequency: frequencyInDays,
            recipient: recipient,
            isActive: true
        }));
        
        emit AutopayScheduled(msg.sender, amount, nextPaymentDate);
    }
    
    function depositAndProtect(uint256 amount, uint256 protectAmount) external nonReentrant {
        require(vaults[msg.sender].isActive, "No vault");
        require(protectAmount <= amount, "Invalid amounts");
        
        usdc.transferFrom(msg.sender, address(this), amount);
        
        Vault storage vault = vaults[msg.sender];
        vault.availableBalance += (amount - protectAmount);
        
        if(protectAmount > 0) {
            vault.protectedBalance += protectAmount;
            usdc.approve(address(aavePool), protectAmount);
            aavePool.supply(address(usdc), protectAmount, address(this), 0);
            emit FundsProtected(msg.sender, protectAmount, "Deposit protection");
        }
    }
    
    function requestEmergencyWithdrawal(uint256 amount) external returns(bytes32) {
        Vault storage vault = vaults[msg.sender];
        require(amount <= vault.protectedBalance, "Insufficient protected");
        
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, amount, block.timestamp));
        requestOwner[requestId] = msg.sender;
        return requestId;
    }
    
    function calculateDailyBudget(address user) public view returns(uint256, uint256) {
        Vault storage vault = vaults[user];
        if(!vault.isActive) return (0, 0);
        
        // Calculate days until next salary (assume 30 day cycle)
        uint256 daysSinceLastProtection = (block.timestamp - vault.lastProtectionDate) / 1 days;
        uint256 daysRemaining = 30 - (daysSinceLastProtection % 30);
        
        if(daysRemaining == 0) daysRemaining = 1;
        
        uint256 dailyBudget = vault.availableBalance / daysRemaining;
        return (dailyBudget, daysRemaining);
    }
    
    function protectFundsForAutopay(uint256 scheduleIndex) external nonReentrant {
        require(vaults[msg.sender].isActive, "No vault");
        require(scheduleIndex < autopaySchedules[msg.sender].length, "Invalid schedule");
        
        AutopaySchedule storage schedule = autopaySchedules[msg.sender][scheduleIndex];
        require(schedule.isActive, "Schedule inactive");
        
        Vault storage vault = vaults[msg.sender];
        uint256 protectAmount = schedule.amount;
        
        require(vault.availableBalance >= protectAmount, "Insufficient balance");
        
        // Move from available to protected
        vault.availableBalance -= protectAmount;
        vault.protectedBalance += protectAmount;
        
        // Deposit to Aave for yield
        usdc.approve(address(aavePool), protectAmount);
        aavePool.supply(address(usdc), protectAmount, address(this), 0);
        
        emit FundsProtected(msg.sender, protectAmount, "Autopay protection");
    }
    
    function approveEmergency(address user, bytes32 requestId) external {
        require(isTrusted[user][msg.sender], "Not trusted");
        require(!emergencyApprovals[requestId][msg.sender], "Already approved");
        
        emergencyApprovals[requestId][msg.sender] = true;
        approvalCount[requestId]++;
    }
    
    function executeEmergencyWithdrawal(bytes32 requestId, uint256 amount) external nonReentrant {
        Vault storage vault = vaults[msg.sender];
        require(approvalCount[requestId] >= vault.requiredApprovals, "Need more approvals");
        
        vault.protectedBalance -= amount;
        aavePool.withdraw(address(usdc), amount, msg.sender);
        
        emit EmergencyWithdrawal(msg.sender, amount, requestId);
    }
    
    function claimYield() external nonReentrant {
        Vault storage vault = vaults[msg.sender];
        uint256 yield = calculateYield(msg.sender);
        
        if(yield > 0) {
            // Calculate protocol fee (0.5%)
            uint256 feeAmount = (yield * YIELD_FEE_PERCENT) / BASIS_POINTS;
            uint256 userYield = yield - feeAmount;
            
            vault.yieldEarned += userYield;
            vault.totalYieldEarned += userYield;
            
            aavePool.withdraw(address(usdc), yield, address(this));
            
            // Transfer user portion
            usdc.transfer(msg.sender, userYield);
            
            // Transfer fee to protocol (owner)
            usdc.transfer(owner(), feeAmount);
            
            emit YieldClaimed(msg.sender, userYield, feeAmount);
        }
    }
    
    function calculateYield(address user) public view returns(uint256) {
        // Simplified - in production, calculate actual Aave yield
        return vaults[user].protectedBalance / 100; // 1% mock yield
    }
    
    function completeProtectionCycle() external {
        Vault storage vault = vaults[msg.sender];
        require(vault.isActive, "No vault");
        
        vault.successfulCycles++;
        vault.lastProtectionDate = block.timestamp;
        
        emit ProtectionCycleCompleted(msg.sender, vault.successfulCycles);
    }
    
    function getVault(address user) external view returns(
        uint256 protectedBalance,
        uint256 availableBalance,
        uint256 yieldEarned,
        uint256 totalYieldEarned,
        uint256 survivalMinimum,
        uint256 successfulCycles,
        address[] memory trustedCircle
    ) {
        Vault storage vault = vaults[user];
        return (
            vault.protectedBalance,
            vault.availableBalance,
            vault.yieldEarned,
            vault.totalYieldEarned,
            vault.survivalMinimum,
            vault.successfulCycles,
            vault.trustedCircle
        );
    }
    
    function getAutopaySchedules(address user) external view returns(AutopaySchedule[] memory) {
        return autopaySchedules[user];
    }
}
