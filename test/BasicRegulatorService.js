var helpers = require("./helpers");
var RegulatorService = artifacts.require("./BasicRegulatorService.sol");

const Facts = [
  1, // KYC
  2, // AML
  3, // ACCRED
]

contract('RegulatorService', async (accounts) => {
  let owner, account, service;

  beforeEach(async () => {
    owner = accounts[0];
    account = accounts[1];

    service = await RegulatorService.new({ from: owner });
  });

  describe('put', async () => {
    let fact;

    beforeEach(() => {
      fact = Facts[0];
    });

    it('should validate the address', async () => {
      assert.isFalse(await service.get.call(account, fact));

      await helpers.expectThrow(
        service.put(0, fact, true, { from: owner })
      );
    });

    it('should only accept transactions from the owner', async () => {
      await helpers.expectThrow(
        service.put(account, fact, true, { from: account })
      );
    });

    it('should store facts', async () => {
      assert.isFalse(await service.get.call(account, fact));
      await service.put(account, fact, true, { from: owner });
      assert.isTrue(await service.get.call(account, fact));
      await service.put(account, fact, false, { from: owner });
      assert.isFalse(await service.get.call(account, fact));
    });
  });

  describe('check', () => {
    it('throws when the participant address is invalid', async () => {
      await helpers.expectThrow(
        service.check(0)
      );
    });

    describe('when all checks can be satisfied on-chain', async () => {
      it('returns true if the participant is eligible', async () => {
        Facts.forEach(async fact => {
          await service.put(account, fact, true);
        });

        assert.isTrue(await service.check.call(account));
      });
    });
  });
});
