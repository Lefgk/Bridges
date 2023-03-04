require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "bsc",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://bsc-dataseed.binance.org",
      },
      //chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.7.6",
        settings: {},
      },
      {
        version: "0.5.16",
        settings: {},
      },
    ],
  },

  settings: {
    optimizer: {
      //   enabled: withOptimizations,
      runs: 200,
    },
  },
  gasReporter: {
    currency: "CHF",
    enabled: false,
    gasPrice: 20,
  },
};
