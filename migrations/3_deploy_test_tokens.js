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

const ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
const TestRegulatorService = artifacts.require("./TestRegulatorService.sol");
const TestRegulatedToken = artifacts.require("./TestRegulatedToken.sol");

module.exports = async function(deployer) {
  const log = deployer.logger.log;
  try {
    await deployer.deploy(TestRegulatorService);
    const regulator = await TestRegulatorService.deployed();

    await deployer.deploy(ServiceRegistry, regulator.address, {overwrite: false});
    const registry = await ServiceRegistry.deployed();

    const copperToken = await deployer.new(TestRegulatedToken, registry.address, "Copper Token", "CPPR")
    log('copperToken.address ' + copperToken.address);

    const silverToken = await deployer.new(TestRegulatedToken, registry.address, "Silver Token", "SLVR")
    log('silverToken.address ' + silverToken.address);

    const goldToken = await deployer.new(TestRegulatedToken, registry.address, "Gold Token", "GOLD")
    log('goldToken.address ' + goldToken.address);
  }
  catch (e) {
    log(e);
  }
};
