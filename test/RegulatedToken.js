var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('RegulatedToken', async function(accounts) {
  let regulator;
  let owner, receiver;

  beforeEach(async () => {
    owner = accounts[0];
    receiver = accounts[1];

    regulator = await MockRegulatorService.new({ from: owner });
  });

  let createToken = async regulatorAddress => {
    let registry = await ServiceRegistry.new(regulator.address);
    let token = await RegulatedToken.new(registry.address);

    await token.mint(owner, 100);
    await token.finishMinting();

    assert.equal(await token.balanceOf.call(owner), 100);

    return token;
  }

  describe('transfer', () => {
    it('throws when the receiver is not approved by the regulator', async () => {
      let token = await createToken(regulator.address);

      await regulator.setCheckResult(false, { from: owner });

      assert.isTrue(await token.isRegulated.call());
      assert.isFalse(await regulator.check.call(token.address, owner, receiver, 0));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('succeeds when the trade is approved by the regulator', async () => {
      let token = await createToken(regulator.address);

      await regulator.setCheckResult(true);

      assert.isTrue(await token.isRegulated.call());
      assert.isTrue(await regulator.check.call(token.address, owner, receiver, 0));

      assert.equal(100, await token.balanceOf.call(owner));
      assert.equal(0, await token.balanceOf.call(receiver));

      await token.transfer(receiver, 25);

      assert.equal(75, await token.balanceOf.call(owner));
      assert.equal(25, await token.balanceOf.call(receiver));
    });
  });
});