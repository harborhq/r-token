var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var ProxyRegulatorService = artifacts.require("./ProxyRegulatorService.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('ProxyRegulatorService', async (accounts) => {
  let owner, newOwner, hacker, participant;
  let service, proxy;

  beforeEach(async () => {
    owner = accounts[0];
    newOwner = accounts[1];
    hacker = accounts[2];
    participant = accounts[3];

    service = await MockRegulatorService.new({ from: owner });
    proxy = await ProxyRegulatorService.new(service.address, { from: owner });
  });

  describe('ownership', () => {
    it('allows ownership transfer', async () => {
      await helpers.expectThrow(
        proxy.transferOwnership(newOwner, { from: hacker })
      );
      await proxy.transferOwnership(newOwner, { from: owner });

      await helpers.expectThrow(
        proxy.transferOwnership(hacker, { from: owner })
      );
      await proxy.transferOwnership(hacker, { from: newOwner });
    });
  });

  describe('replaceService', () => {
    let newService;

    beforeEach(async () => {
      assert.equal(await proxy.owner(), owner);
      assert.equal(await proxy.service(), service.address);

      newService = await MockRegulatorService.new({ from: owner });
    });

    it('should allow the owner to replace the service', async () => {
      await proxy.replaceService(newService.address);
      assert.equal(await proxy.service(), newService.address);
    });

    it('should NOT allow an invalid address', async () => {
      await helpers.expectThrow(
        proxy.replaceService(0)
      );
      assert.equal(await proxy.service(), service.address);
    });

    it('should NOT allow anybody except for the owner to replace the service', async () => {
      await helpers.expectThrow(
        proxy.replaceService(newService.address, { from: hacker })
      );
      assert.equal(await proxy.service(), service.address);
    });
  });

  describe('check', () => {
    it('should proxy the check call', async () => {
      assert.isFalse(await proxy.check.call(hacker));
      await service.setCheckResult(true);
      assert.isTrue(await proxy.check.call(hacker));
    });
  });
});