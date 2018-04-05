/*******************************************************************************
 * What:
 * Mints TestRegulatorTokens to specified wallet address.
 *
 * Usage:
 * node scripts/mint_test_tokens.js env numberOfTokens tokenSymbol toWalletAddress
 *
 * Example:
 * node scripts/mint_test_tokens.js development 100 CPPR 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498
 ******************************************************************************/

console.log('STARTING');
const Web3 = require('web3');
const TestRegulatedTokenJson = require('../build/contracts/TestRegulatedToken');
const BigNumber = require('bignumber.js');
const HDWalletProvider = require('truffle-hdwallet-provider');

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
  },
  kovan: {
    tokenAddresses: {
      'CPPR': '0x5cdcc989560693e845060d271399216d8ab00c25',
      'SLVR': '0x9843430d81290c90701bd655a7f19222b1de1f5f',
      'GOLD': '0x88c3f6e2ddd8e65ec548197f2670623c5d876459'
    }
  }
};

const config = configs[env];
ensure(config, 'No config');

const tokenAddress = config.tokenAddresses[tokenSymbol];
ensure(tokenAddress, 'No tokenAddress');

let provider;
if (env === 'kovan') {
  const kovanMnemonic = process.env['RTOKEN_KOVAN_MNEMONIC'];
  ensure(kovanMnemonic, 'No kovanMnemonic');
  const infuraKey = process.env['INFURA_KEY'];
  ensure(infuraKey, 'No infuraKey');
  provider = new HDWalletProvider(kovanMnemonic, `https://kovan.infura.io/${infuraKey}`);
} else {
  provider = new Web3.providers.HttpProvider('http://localhost:8545');
}
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

    const transaction = await token.methods.mint(mintToWallet, toMintAmount).send();
    console.log('transaction:', transaction.status, transaction.transactionHash);

    const tokenBalance = await token.methods.balanceOf(mintToWallet).call({from: myAddress})
    console.log(`mintToWallet.${tokenSymbol}.balance:`, tokenBalance);
    console.log('DONE');
  }
  catch (e) {
    console.log(e);
  }
})();
