const helpers = require("./helpers");
      RegulatedToken = artifacts.require("./RegulatedToken.sol"),
      ServiceRegistry = artifacts.require("./ServiceRegistry.sol"),
      MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol"),
      BigNumber = require('bignumber.js');

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

  const assertCheckStatusEvent = async (event, success, reason) => {
    return helpers.assertEvent(event, { success, reason: new BigNumber(reason) }, (expected, actual) => {
        assert.equal(expected.success, actual.success);
        assert.equal(expected.reason.valueOf(), actual.reason.valueOf());
    });
  }

  const checkResult = async (tokenAddress, sender, receiver, amount) => {
    const status = await regulator.check.call(tokenAddress, sender, receiver, amount);
    return status[0];
  }

  describe('transfer', () => {
    describe('when the transfer is NOT approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(false);

        assert.isTrue(await token.isRegulated.call());
        assert.isFalse(await checkResult(token.address, owner, receiver, 0));

        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('returns false', async () => {
        assert.isFalse(await token.transfer.call(receiver, 100));
        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('triggers a CheckStatus event and does NOT transfer funds', async () => {
        let event = token.CheckStatus();

        await token.transfer(receiver, 25);
        await assertCheckStatusEvent(event, false, 0);
        await assertBalances({ owner: 100, receiver: 0 });
      });
    });

    describe('when the transfer is approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(true);

        assert.isTrue(await token.isRegulated.call());
        assert.isTrue(await checkResult(token.address, owner, receiver, 0));

        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('returns true', async () => {
        assert.isTrue(await token.transfer.call(receiver, 100));

        // note: calls don't modify state
        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('triggers a CheckStatus event and transfers funds', async () => {
        let event = token.CheckStatus();

        await token.transfer(receiver, 25);
        await assertCheckStatusEvent(event, true, 0);
        await assertBalances({ owner: 75, receiver: 25 });
      });
    });
  });

  describe('transferFrom', () => {
    describe('when the transfer is NOT approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(false);

        assert.isTrue(await token.isRegulated.call());
        assert.isFalse(await checkResult(token.address, owner, receiver, 0));

        await token.approve(receiver, 25);

        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('returns false', async () => {
        assert.isFalse(await token.transferFrom.call(owner, receiver, 20, { from: receiver }));
        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('triggers a CheckStatus event and does NOT transfer funds', async () => {
        let event = token.CheckStatus();

        await token.transferFrom(owner, receiver, 25);

        await assertCheckStatusEvent(event, false, 0);
        await assertBalances({ owner: 100, receiver: 0 });
      });
    });

    describe('when the transfer is approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(true);

        assert.isTrue(await token.isRegulated.call());
        assert.isTrue(await checkResult(token.address, owner, receiver, 0));

        await token.approve(receiver, 25);

        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('returns true', async () => {
        assert.isTrue(await token.transferFrom.call(owner, receiver, 25, { from: receiver }));

        // note: calls don't modify state
        await assertBalances({ owner: 100, receiver: 0 });
      });

      it('triggers a CheckStatus event and transfers funds', async () => {
        let event = token.CheckStatus();

        await token.transferFrom(owner, receiver, 20, { from: receiver });
        await assertCheckStatusEvent(event, true, 0);
        await assertBalances({ owner: 80, receiver: 20 });

        await token.transferFrom(owner, receiver, 5, { from: receiver });
        await assertBalances({ owner: 75, receiver: 25 });
      });
    });
  });
});