var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var RegulatorService = artifacts.require("./RegulatorService.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('RegulatedToken', async function(accounts) {
  let token, owner, receiver, hacker;

  beforeEach(async () => {
    owner = accounts[0];
    receiver = accounts[1];
    hacker = accounts[2];

    token = await RegulatedToken.new({ from: owner });
    await token.mint(owner, 100);
    await token.finishMinting();

    assert.equal(await token.balanceOf.call(owner), 100);
  });

  describe('registration', () => {
    let regulator;

    beforeEach(async () => {
      regulator = await RegulatorService.new({ from: owner });
    });

    it('only allows owners to register the RegulatorService', async () => {
      assert.isFalse(await token.isRegistered.call());

      await helpers.expectThrow(
        token.register(regulator.address, { from: hacker })
      )

      let event = token.RegulatorRegistered();

      await token.register(regulator.address, { from: owner });
      await assert.isTrue(await token.isRegistered.call());

      await helpers.assertEvent(event, { _regulator: regulator.address });
    });
  });

  describe('transfer', () => {
    let regulator;

    beforeEach(async () => {
      regulator = await MockRegulatorService.new({ from: owner });
    });

    it('throws when there is no regulator', async () => {
      assert.isFalse(await token.isRegistered.call());

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('throws when the receiver is not approved by the regulator', async () => {
      await regulator.setCheckResult(false, { from: owner });
      await token.register(regulator.address, { from: owner });

      assert.isTrue(await token.isRegistered.call());
      assert.isFalse(await regulator.check.call(receiver));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('succeeds when the trade is approved by the regulator', async () => {
      await regulator.setCheckResult(true, { from: owner });
      await token.register(regulator.address, { from: owner });

      assert.isTrue(await token.isRegistered.call());
      assert.isTrue(await regulator.check.call(receiver));

      assert.equal(0, await token.balanceOf.call(receiver));
      await token.transfer(receiver, 100);
      assert.equal(100, await token.balanceOf.call(receiver));
    });
  });
});