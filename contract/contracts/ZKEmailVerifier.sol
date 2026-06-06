// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ZKEmailVerifier
 * @notice Verifies email approvals using zero-knowledge proofs
 * @dev Allows trusted circle to approve without wallet/gas
 */
contract ZKEmailVerifier {
    struct EmailProof {
        bytes32 emailHash;
        address signer;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(bytes32 => EmailProof) public proofs;
    mapping(address => string) public emailAddresses;
    
    event EmailRegistered(address indexed user, bytes32 emailHash);
    event ProofVerified(bytes32 indexed proofId, address indexed signer);
    
    function registerEmail(string memory email) external {
        bytes32 emailHash = keccak256(abi.encodePacked(email));
        emailAddresses[msg.sender] = email;
        emit EmailRegistered(msg.sender, emailHash);
    }
    
    function verifyEmailApproval(
        bytes32 proofId,
        bytes32 emailHash,
        address signer,
        bytes memory zkProof
    ) external returns(bool) {
        // Simplified - in production use actual ZK proof verification
        require(!proofs[proofId].verified, "Already verified");
        
        proofs[proofId] = EmailProof({
            emailHash: emailHash,
            signer: signer,
            timestamp: block.timestamp,
            verified: true
        });
        
        emit ProofVerified(proofId, signer);
        return true;
    }
    
    function isEmailVerified(bytes32 proofId) external view returns(bool) {
        return proofs[proofId].verified;
    }
}
