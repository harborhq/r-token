const Web3 = require('web3');
const web3 = new Web3();
const HDWalletProvider = require('truffle-hdwallet-provider');

const kovanMnemonic = process.env['RTOKEN_KOVAN_MNEMONIC'];
const infuraKey = process.env['INFURA_KEY'];

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: new HDWalletProvider(kovanMnemonic, `https://kovan.infura.io/${infuraKey}`),
      network_id: '42'
    }
  }
};
