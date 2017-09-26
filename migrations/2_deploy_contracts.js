// var ConvertLib = artifacts.require("./ConvertLib.sol");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var RegulatorService = artifacts.require("./RegulatorService.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
  deployer.deploy(RegulatedToken);
  deployer.deploy(RegulatorService);
};
