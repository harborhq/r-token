var helpers = require("./helpers");
var RegulatorService = artifacts.require("./TokenRegulatorService.sol");

contract('TokenRegulatorService', async (accounts) => {
  let owner, account, token, service;

  beforeEach(async () => {
    owner = accounts[0];
    account = accounts[1];
    token = '0xF433089366899D83a9f26A773D59ec7eCF30355e';

    service = await RegulatorService.new({ from: owner });
  });

  describe('put', async () => {
    it('should only accept transactions from the owner', async () => {
      await helpers.expectThrow(
        service.put(token, account, true, { from: account })
      );
    });

    it('stores eligible participants on a per token basis', async () => {
      assert.isFalse(await service.get.call(token, account));
      await service.put(token, account, true);
      assert.isTrue(await service.get.call(token, account));
    });
  });

  describe('check', () => {
    it('returns true if the receiver is eligible', async () => {
      assert.isFalse(await service.check.call(token, owner, account, 10));
      await service.put(token, account, true);
      assert.isTrue(await service.check.call(token, owner, account, 10));
    });
  });
});
