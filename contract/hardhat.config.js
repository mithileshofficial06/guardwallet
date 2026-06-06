import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "cancun"
    }
  },
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.ALCHEMY_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || ""
  }
};
