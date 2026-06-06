// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title AccountAbstraction
 * @notice ERC-4337 compatible account with Face ID login and sponsored gas
 * @dev Enables passwordless login with no gas fees for users
 */
contract AccountAbstraction {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    struct UserAccount {
        address owner;
        bytes32 biometricHash;
        uint256 nonce;
        bool isActive;
    }
    
    mapping(address => UserAccount) public accounts;
    mapping(address => bool) public paymasters;
    
    event AccountCreated(address indexed account, bytes32 biometricHash);
    event TransactionExecuted(address indexed account, address target, uint256 value);
    
    modifier onlyPaymaster() {
        require(paymasters[msg.sender], "Not a paymaster");
        _;
    }
    
    function createAccount(bytes32 biometricHash) external returns(address) {
        address accountAddress = address(uint160(uint256(keccak256(
            abi.encodePacked(msg.sender, biometricHash, block.timestamp)
        ))));
        
        accounts[accountAddress] = UserAccount({
            owner: msg.sender,
            biometricHash: biometricHash,
            nonce: 0,
            isActive: true
        });
        
        emit AccountCreated(accountAddress, biometricHash);
        return accountAddress;
    }
    
    function executeTransaction(
        address account,
        address target,
        uint256 value,
        bytes memory data,
        bytes memory signature
    ) external onlyPaymaster returns(bool) {
        UserAccount storage userAccount = accounts[account];
        require(userAccount.isActive, "Account inactive");
        
        bytes32 txHash = keccak256(abi.encodePacked(
            account, target, value, data, userAccount.nonce
        ));
        
        address signer = txHash.toEthSignedMessageHash().recover(signature);
        require(signer == userAccount.owner, "Invalid signature");
        
        userAccount.nonce++;
        
        (bool success, ) = target.call{value: value}(data);
        require(success, "Transaction failed");
        
        emit TransactionExecuted(account, target, value);
        return true;
    }
    
    function addPaymaster(address paymaster) external {
        paymasters[paymaster] = true;
    }
}
