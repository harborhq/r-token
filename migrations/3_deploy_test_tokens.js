const ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
const TestRegulatorService = artifacts.require("./TestRegulatorService.sol");
const TestRegulatedToken = artifacts.require("./TestRegulatedToken.sol");

module.exports = async function(deployer) {
  try {
    await deployer.deploy(TestRegulatorService);
    const regulator = await TestRegulatorService.deployed();

    await deployer.deploy(ServiceRegistry, regulator.address, {overwrite: false});
    const registry = await ServiceRegistry.deployed();

    const copperToken = await deployer.new(TestRegulatedToken, registry.address, "Copper Token", "CPPR")
    console.log('copperToken.address', copperToken.address)

    const silverToken = await deployer.new(TestRegulatedToken, registry.address, "Silver Token", "SLVR")
    console.log('silverToken.address', silverToken.address)

    const goldToken = await deployer.new(TestRegulatedToken, registry.address, "Gold Token", "GOLD")
    console.log('goldToken.address', goldToken.address)
  }
  catch (e) {
    console.log(e)
  }
};
