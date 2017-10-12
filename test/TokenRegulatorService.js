var helpers = require("./helpers");
var TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

contract('TokenRegulatorService', async (accounts) => {
  let owner, account, token, service;

  beforeEach(async () => {
    owner = accounts[0];
    account = accounts[1];
    token = '0xF433089366899D83a9f26A773D59ec7eCF30355e';

    service = await TokenRegulatorService.new({ from: owner });
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
    ownership('lock', () => { return [service, token] });
    ownership('unlock', () => { return [service, token] });
    ownership('setParticipation', () => { return [service, token, account, 0] });
  });

  describe('locking', async () => {
    beforeEach(async () => {
      await service.setParticipation(token, owner, true);
      await service.setParticipation(token, account, true);
    });

    it('is locked by default', async () => {
      assert.isFalse(await service.check.call(token, owner, account, 0));
    });

    it('toggles the ability to trade', async () => {
      assert.isFalse(await service.check.call(token, owner, account, 0));
      await service.unlock(token);
      assert.isTrue(await service.check.call(token, owner, account, 0));
      await service.lock(token);
      assert.isFalse(await service.check.call(token, owner, account, 0));
    });
  });

  describe('participation', async () => {
    beforeEach(async () => {
      await service.unlock(token);
    });

    describe('when both participants are eligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token, owner, false);
        await service.setParticipation(token, account, false);
        assert.isFalse(await service.check.call(token, owner, account, 0));
      });

      it('allows trades', async () => {
        await service.setParticipation(token, owner, true);
        await service.setParticipation(token, account, true);

        assert.isTrue(await service.check.call(token, owner, account, 0));
      });
    });

    describe('when one participant is ineligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token, owner, true);
        await service.setParticipation(token, account, true);
        assert.isTrue(await service.check.call(token, owner, account, 0));
      });

      it('prevents trades', async () => {
        await service.setParticipation(token, owner, true);
        await service.setParticipation(token, account, false);

        assert.isFalse(await service.check.call(token, owner, account, 0));

        await service.setParticipation(token, owner, false);
        await service.setParticipation(token, account, true);

        assert.isFalse(await service.check.call(token, owner, account, 0));
      });
    });

    describe('when no participants are eligible', () => {
      beforeEach(async () => {
        await service.setParticipation(token, owner, true);
        await service.setParticipation(token, account, true);
        assert.isTrue(await service.check.call(token, owner, account, 0));
      });

      it('prevents trades', async () => {
        await service.setParticipation(token, owner, false);
        await service.setParticipation(token, account, false);

        assert.isFalse(await service.check.call(token, owner, account, 0));
      });
    });
  });
});
