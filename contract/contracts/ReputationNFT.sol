// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct CreditScore {
        uint256 score;
        uint256 onTimePayments;
        uint256 totalPayments;
        uint256 lastUpdated;
    }
    
    mapping(uint256 => CreditScore) public creditScores;
    mapping(address => uint256) public userTokenId;
    
    event ScoreUpdated(address indexed user, uint256 tokenId, uint256 newScore);
    event PaymentRecorded(address indexed user, bool onTime);
    
    constructor() ERC721("GuardWallet Credit Score", "GWCS") {}
    
    function mintCreditScore(address user) external onlyOwner returns(uint256) {
        require(userTokenId[user] == 0, "Already has NFT");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _mint(user, tokenId);
        userTokenId[user] = tokenId;
        
        creditScores[tokenId] = CreditScore({
            score: 300, // Starting credit score
            onTimePayments: 0,
            totalPayments: 0,
            lastUpdated: block.timestamp
        });
        
        return tokenId;
    }
    
    function recordPayment(address user, bool onTime) external onlyOwner {
        uint256 tokenId = userTokenId[user];
        require(tokenId != 0, "No NFT");
        
        CreditScore storage credit = creditScores[tokenId];
        credit.totalPayments++;
        
        if(onTime) {
            credit.onTimePayments++;
            credit.score = _min(850, credit.score + 5); // Max 850 score
        } else {
            credit.score = _max(300, credit.score - 10); // Min 300 score
        }
        
        credit.lastUpdated = block.timestamp;
        
        emit PaymentRecorded(user, onTime);
        emit ScoreUpdated(user, tokenId, credit.score);
    }
    
    function getCreditScore(address user) external view returns(
        uint256 score,
        uint256 onTimePayments,
        uint256 totalPayments,
        uint256 paymentRate
    ) {
        uint256 tokenId = userTokenId[user];
        require(tokenId != 0, "No NFT");
        
        CreditScore storage credit = creditScores[tokenId];
        uint256 rate = credit.totalPayments > 0 
            ? (credit.onTimePayments * 100) / credit.totalPayments 
            : 0;
            
        return (
            credit.score,
            credit.onTimePayments,
            credit.totalPayments,
            rate
        );
    }
    
    function _min(uint256 a, uint256 b) private pure returns(uint256) {
        return a < b ? a : b;
    }
    
    function _max(uint256 a, uint256 b) private pure returns(uint256) {
        return a > b ? a : b;
    }
    
    // Soulbound - non-transferrable
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Soulbound: Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
