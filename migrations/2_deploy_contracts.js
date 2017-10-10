var RegulatedToken = artifacts.require("./RegulatedToken.sol"),
    BasicRegulatorService = artifacts.require("./BasicRegulatorService.sol"),
    TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

module.exports = function(deployer) {
  deployer.deploy(RegulatedToken);
  deployer.deploy(BasicRegulatorService);
  deployer.deploy(TokenRegulatorService);
};
