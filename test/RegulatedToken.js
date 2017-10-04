var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var RegulatorService = artifacts.require("./RegulatorService.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('RegulatedToken', async function(accounts) {
  let token, regulator;
  let owner, receiver;

  beforeEach(async () => {
    owner = accounts[0];
    receiver = accounts[1];

    regulator = await MockRegulatorService.new({ from: owner });

    token = await RegulatedToken.new(regulator.address, { from: owner });
    await token.mint(owner, 100);
    await token.finishMinting();

    assert.equal(await token.balanceOf.call(owner), 100);
  });

  describe('transfer', () => {
    it('throws when the receiver is not approved by the regulator', async () => {
      await regulator.setCheckResult(false, { from: owner });

      assert.isTrue(await token.isRegulated.call());
      assert.isFalse(await regulator.check.call(receiver));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('succeeds when the trade is approved by the regulator', async () => {
      await regulator.setCheckResult(true, { from: owner });

      assert.isTrue(await token.isRegulated.call());
      assert.isTrue(await regulator.check.call(receiver));

      assert.equal(0, await token.balanceOf.call(receiver));
      await token.transfer(receiver, 100);
      assert.equal(100, await token.balanceOf.call(receiver));
    });
  });
});