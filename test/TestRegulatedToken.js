const TestRegulatedToken = artifacts.require('./TestRegulatedToken.sol');
const ServiceRegistry = artifacts.require('./ServiceRegistry.sol');
const TestRegulatorService = artifacts.require('./TestRegulatorService.sol');

contract('TestRegulatedToken', async function(accounts) {
  let regulator;
  let token;
  const owner = accounts[0];     // Owner of the TestRegulatedToken
  const notOwner = accounts[1];  // Not the owner of the TestRegulatedToken
  const fromOwner = { from: owner };
  const fromNotOwner = { from: notOwner };

  beforeEach(async () => {
    regulator = await TestRegulatorService.new(fromOwner);

    const registry = await ServiceRegistry.new(regulator.address);

    token = await TestRegulatedToken.new(registry.address, 'Test', 'TEST');
  });

  describe('minting', () => {
    beforeEach(async () => {
      assert.equal((await token.owner.call()).valueOf(), owner);
      assert.equal((await token.balanceOf.call(owner)).valueOf(), 0);
      assert.equal((await token.balanceOf.call(notOwner)).valueOf(), 0);
    });

    it('lets people other than the token owner mint', async () => {
      await token.mint(notOwner, 100, fromNotOwner);
      assert.equal((await token.balanceOf.call(notOwner)).valueOf(), 100);
    });

    it('lets people mint after finishMinting()', async () => {
      await token.finishMinting();
      // Owner can still mint
      await token.mint(owner, 100, fromOwner);
      assert.equal((await token.balanceOf.call(owner)).valueOf(), 100);
      // NotOwner can still mint
      await token.mint(notOwner, 200, fromNotOwner);
      assert.equal((await token.balanceOf.call(notOwner)).valueOf(), 200);
    });
  });
});
