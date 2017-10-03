var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var RegulatorService = artifacts.require("./RegulatorService.sol");

module.exports = function(deployer) {
  deployer.deploy(RegulatedToken);
  deployer.deploy(RegulatorService);
};
