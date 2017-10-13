var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('RegulatedToken', async function(accounts) {
  let regulator, token;
  let owner, receiver;

  beforeEach(async () => {
    owner = accounts[0];
    receiver = accounts[1];
    regulator = await MockRegulatorService.new({ from: owner });

    let registry = await ServiceRegistry.new(regulator.address);

    token = await RegulatedToken.new(registry.address);

    await token.mint(owner, 100);
    await token.finishMinting();

    await assertBalances({ owner: 100, receiver: 0 });
  });

  const assertBalances = async (balances) => {
    assert.equal(balances.owner, (await token.balanceOf.call(owner)).valueOf());
    assert.equal(balances.receiver, (await token.balanceOf.call(receiver)).valueOf());
  }

  describe('transfer', () => {
    it('throws when the transfer is NOT approved by the regulator', async () => {
      await regulator.setCheckResult(false);

      assert.isTrue(await token.isRegulated.call());
      assert.isFalse(await regulator.check.call(token.address, owner, receiver, 0));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('succeeds when the transfer is approved by the regulator', async () => {
      await regulator.setCheckResult(true);

      assert.isTrue(await token.isRegulated.call());
      assert.isTrue(await regulator.check.call(token.address, owner, receiver, 0));

      await assertBalances({ owner: 100, receiver: 0 });
      await token.transfer(receiver, 25);
      await assertBalances({ owner: 75, receiver: 25 });
    });
  });

  describe('transferFrom', async () => {
    it('throws when the transfer is NOT approved by the regulator', async () => {
      await regulator.setCheckResult(false);

      assert.isTrue(await token.isRegulated.call());
      assert.isFalse(await regulator.check.call(token.address, owner, receiver, 0));

      await token.approve(receiver, 25);

      await helpers.expectThrow(
        token.transferFrom(owner, receiver, 20, { from: receiver })
      );
    });

    it('succeeds when the transfer is approved by the regulator', async () => {
      await regulator.setCheckResult(true);

      assert.isTrue(await token.isRegulated.call());
      assert.isTrue(await regulator.check.call(token.address, owner, receiver, 0));

      await token.approve(receiver, 25);
      await token.transferFrom(owner, receiver, 20, { from: receiver })

      await assertBalances({ owner: 80, receiver: 20 });
      await token.transferFrom(owner, receiver, 5, { from: receiver })
      await assertBalances({ owner: 75, receiver: 25 });
    });
  });
});