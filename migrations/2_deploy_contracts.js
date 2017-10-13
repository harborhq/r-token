var RegulatedToken = artifacts.require("./RegulatedToken.sol"),
    ServiceRegistry = artifacts.require("./ServiceRegistry.sol"),
    TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

module.exports = async function(deployer) {

  deployer.deploy(TokenRegulatorService).then(async () => {
    const token = await TokenRegulatorService.deployed();
    return deployer.deploy(ServiceRegistry, token.address);
  }).then(async () => {
    const registry = await ServiceRegistry.deployed();
    return deployer.deploy(RegulatedToken, registry.address);
  });
};
