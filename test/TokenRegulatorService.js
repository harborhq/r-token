var helpers = require("./helpers");
var MockRegulatedToken = artifacts.require("../test/helpers/MockRegulatedToken.sol");
var TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

contract('TokenRegulatorService', async (accounts) => {
  let owner, account, token, service;

  beforeEach(async () => {
    owner = accounts[0];
    account = accounts[1];

    service = await TokenRegulatorService.new({ from: owner });
    token = await MockRegulatedToken.new();
  });

  const ownership = (method, producer) => {
    it(method + ' requires owner permissions', async () => {
      let [service, ...args] = producer();

      let acct = accounts[accounts.length - 1];

      assert.isTrue(!!acct);
      assert.isTrue(acct != accounts[0]);

      await helpers.expectThrow(
        service[method](...args, { from: acct })
      );
    });
  }

  describe('permissions', () => {
    ownership('lock', () => { return [service, token.address] });
    ownership('unlock', () => { return [service, token.address] });
    ownership('allowPartialTransfers', () => { return [service, token.address] });
    ownership('disallowPartialTransfers', () => { return [service, token.address] });
    ownership('setParticipation', () => { return [service, token.address, account, 0] });
  });

  describe('locking', async () => {
    beforeEach(async () => {
      await service.setParticipation(token.address, owner, true);
      await service.setParticipation(token.address, account, true);
    });

    it('is locked by default', async () => {
      assert.isFalse(await service.check.call(token.address, owner, account, 0));
    });

    it('toggles the ability to trade', async () => {
      assert.isFalse(await service.check.call(token.address, owner, account, 0));
      await service.unlock(token.address);
      assert.isTrue(await service.check.call(token.address, owner, account, 0));
      await service.lock(token.address);
      assert.isFalse(await service.check.call(token.address, owner, account, 0));
    });
  });

  describe('partial trades', () => {
    beforeEach(async () => {
      await service.unlock(token.address);
      await service.setParticipation(token.address, owner, true);
      await service.setParticipation(token.address, account, true);

      const decimals = 4,
            expectedTotalSupply = 2000 * 10**decimals;

      await token.setDecimals(decimals);
      await token.mint(owner, expectedTotalSupply);

      assert.equal(expectedTotalSupply, await token.totalSupply.call());

      assert.isFalse(await service.check.call(token.address, owner, account, 10001111));
    });

    describe('when partial trades are allowed', async () => {
      it('allows fractional trades', async () => {
        await service.allowPartialTransfers(token.address);
        assert.isTrue(await service.check.call(token.address, owner, account, 10001111));
        assert.isTrue(await service.check.call(token.address, owner, account, 10000000));
      });
    });

    describe('when partial trades are NOT allowed', async () => {
      it('does NOT allow fractional trades', async () => {
        await service.disallowPartialTransfers(token.address);
        assert.isTrue(await service.check.call(token.address, owner, account, 10000000));
        assert.isFalse(await service.check.call(token.address, owner, account, 10001111));
      });
    });
  });

  describe('participation', async () => {
    beforeEach(async () => {
      await service.unlock(token.address);
    });

    describe('when both participants are eligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token.address, owner, false);
        await service.setParticipation(token.address, account, false);
        assert.isFalse(await service.check.call(token.address, owner, account, 0));
      });

      it('allows trades', async () => {
        await service.setParticipation(token.address, owner, true);
        await service.setParticipation(token.address, account, true);

        assert.isTrue(await service.check.call(token.address, owner, account, 0));
      });
    });

    describe('when one participant is ineligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token.address, owner, true);
        await service.setParticipation(token.address, account, true);
        assert.isTrue(await service.check.call(token.address, owner, account, 0));
      });

      it('prevents trades', async () => {
        await service.setParticipation(token.address, owner, true);
        await service.setParticipation(token.address, account, false);

        assert.isFalse(await service.check.call(token.address, owner, account, 0));

        await service.setParticipation(token.address, owner, false);
        await service.setParticipation(token.address, account, true);

        assert.isFalse(await service.check.call(token.address, owner, account, 0));
      });
    });

    describe('when no participants are eligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token.address, owner, true);
        await service.setParticipation(token.address, account, true);
        assert.isTrue(await service.check.call(token.address, owner, account, 0));
      });

      it('prevents trades', async () => {
        await service.setParticipation(token.address, owner, false);
        await service.setParticipation(token.address, account, false);

        assert.isFalse(await service.check.call(token.address, owner, account, 0));
      });
    });
  });
});
