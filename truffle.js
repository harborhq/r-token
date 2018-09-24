/**
   Copyright (c) 2017 Harbor Platform, Inc.

   Licensed under the Apache License, Version 2.0 (the “License”);
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an “AS IS” BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
