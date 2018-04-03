
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.RTOKEN_DEVELOPMENT_MNEMONIC
console.log(mnemonic)
var provider = new HDWalletProvider(mnemonic, "http://localhost:8545");
