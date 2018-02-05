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
