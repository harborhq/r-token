// What:
// Mints TestRegulatorTokens to specified wallet address.
// Usage:
// node scripts/mint_test_tokens.js env numberOfTokens tokenSymbol toWalletAddress
// Example:
// node scripts/mint_test_tokens.js development 100 CPPR 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498

console.log('STARTING');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const TestRegulatedTokenJson = require('../build/contracts/TestRegulatedToken');
const BigNumber = require('bignumber.js');

/*******************************************************************************
 * Input validation & Init
 ******************************************************************************/
const ensure = (condition, msg) => {
  if (!condition) {
    console.log('ERROR:', msg);
    process.exit(1);
  }
};

const env = process.argv[2];
console.log('env:', env);
ensure(env, 'No env');

const numberOfTokens = process.argv[3];
console.log('numberOfTokens:', numberOfTokens);
ensure(numberOfTokens, 'No numberOfTokens');

const tokenSymbol = process.argv[4];
console.log('tokenSymbol:', tokenSymbol);
ensure(tokenSymbol, 'No tokenSymbol');

const mintToWallet = process.argv[5];
console.log('mintToWallet:', mintToWallet);
ensure(mintToWallet, 'No mintToWallet');

const configs = {
  development: {
    tokenAddresses: {
      'CPPR': '0x8ef59034b52138fbcb1d36607fb5dd665fc7bc1c',
      'SLVR': '0x6d966540214a7a55f61244e346d0ae6033ace4f8',
      'GOLD': '0x3b6b17477763ccb313a55e87fd104c37e3e01f33'
    }
  }
};
const config = configs[env];
ensure(config, 'No config');

const tokenAddress = config.tokenAddresses[tokenSymbol];
ensure(tokenAddress, 'No tokenAddress');

const mnemonicVar = `RTOKEN_${env.toUpperCase()}_MNEMONIC`;
const mnemonic = process.env[mnemonicVar]
console.log('mnemonic:', mnemonic)
ensure(mnemonic, 'No mnemonic for', mnemonicVar);

// TODO pick wallet based on env
var provider = new HDWalletProvider(mnemonic, 'http://localhost:8545');
const web3 = new Web3(provider);

/*******************************************************************************
 * Actually Mint
 ******************************************************************************/
;(async () => {
  try {
    const myAddress = (await web3.eth.getAccounts())[0];
    console.log('myAddress:', myAddress);

    const ethBalance = await web3.eth.getBalance(myAddress);
    console.log('myAddress.eth.balance:', web3.utils.fromWei(ethBalance, 'ether'));

    var token = await new web3.eth.Contract(TestRegulatedTokenJson.abi, tokenAddress, {from: myAddress, gas: 5000000});

    const toMintAmount = web3.utils.toWei(new BigNumber(numberOfTokens).toString(), 'ether');
    console.log(`mintToWallet.${tokenSymbol}.toMintAmount:`, toMintAmount);

    await token.methods.mint(mintToWallet, toMintAmount).send();

    const tokenBalance = await token.methods.balanceOf(mintToWallet).call({from: myAddress})
    console.log(`mintToWallet.${tokenSymbol}.balance:`, tokenBalance);
    console.log('DONE');
  }
  catch (e) {
    console.log(e);
  }
})();
