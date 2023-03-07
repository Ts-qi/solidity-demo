require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.7.3",
  networks: {
    goerli: {
      url:process.env.ALCHEMY_URL,
      accounts:[process.env.WALLET_PRIVATY_KEY]
    }
  }
};
// 0x79BBb3c0bC241c4B34A662a8cfc635c623941B01