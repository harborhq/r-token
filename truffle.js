const Web3 = require('web3');
const web3 = new Web3();
const HDWalletProvider = require('truffle-hdwallet-provider');

let infuraTestNetworks = {}
var kovanMnemonic = process.env['RTOKEN_KOVAN_MNEMONIC'];
if (kovanMnemonic) {
  infuraTestNetworks = {
    kovan: {
      host: 'localhost',
      port: 8545,
      network_id: '42',
      gas: 4600000,
      gasPrice: web3.toWei(13, 'gwei'),
      provider: new HDWalletProvider(kovanMnemonic, 'https://kovan.infura.io/', 0, 10)
    }
  }
}

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ...infuraTestNetworks
  }
};
