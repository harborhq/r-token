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

var RegulatedToken = artifacts.require("./RegulatedToken.sol"),
    ServiceRegistry = artifacts.require("./ServiceRegistry.sol"),
    TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

module.exports = async function(deployer) {

  deployer.deploy(TokenRegulatorService).then(async () => {
    const regulator = await TokenRegulatorService.deployed();
    return deployer.deploy(ServiceRegistry, regulator.address);
  }).then(async () => {
    const registry = await ServiceRegistry.deployed();
    return deployer.deploy(RegulatedToken, registry.address, "Example", "EXPL");
  }).then(async () => {
    const token = await RegulatedToken.deployed();
  });
};
