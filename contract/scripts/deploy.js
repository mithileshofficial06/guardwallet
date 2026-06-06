const hre = require("hardhat");

async function main() {
  console.log("Deploying GuardWallet contracts to Polygon Mumbai...");

  // Mumbai testnet addresses
  const USDC_MUMBAI = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"; // Mock USDC
  const AAVE_POOL_MUMBAI = "0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B"; // Aave V3 Pool

  // Deploy GuardVault
  const GuardVault = await hre.ethers.getContractFactory("GuardVault");
  const guardVault = await GuardVault.deploy(USDC_MUMBAI, AAVE_POOL_MUMBAI);
  await guardVault.deployed();
  console.log("GuardVault deployed to:", guardVault.address);

  // Deploy AutopayGuard
  const AutopayGuard = await hre.ethers.getContractFactory("AutopayGuard");
  const autopayGuard = await AutopayGuard.deploy(USDC_MUMBAI);
  await autopayGuard.deployed();
  console.log("AutopayGuard deployed to:", autopayGuard.address);

  // Deploy ReputationNFT
  const ReputationNFT = await hre.ethers.getContractFactory("ReputationNFT");
  const reputationNFT = await ReputationNFT.deploy();
  await reputationNFT.deployed();
  console.log("ReputationNFT deployed to:", reputationNFT.address);

  console.log("\n=== Deployment Summary ===");
  console.log("GuardVault:", guardVault.address);
  console.log("AutopayGuard:", autopayGuard.address);
  console.log("ReputationNFT:", reputationNFT.address);
  console.log("\nUpdate your .env files with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
