var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var ServiceRegistry = artifacts.require("./ServiceRegistry.sol");
var MockRegulatorService = artifacts.require("../test/helpers/MockRegulatorService.sol");

contract('ServiceRegistry', async (accounts) => {
  let owner, newOwner, hacker, participant;
  let service, registry;

  beforeEach(async () => {
    owner = accounts[0];
    newOwner = accounts[1];
    hacker = accounts[2];
    participant = accounts[3];

    service = await MockRegulatorService.new({ from: owner });
    registry = await ServiceRegistry.new(service.address, { from: owner });
  });

  describe('ownership', () => {
    it('allows ownership transfer', async () => {
      await helpers.expectThrow(
        registry.transferOwnership(newOwner, { from: hacker })
      );
      await registry.transferOwnership(newOwner, { from: owner });

      await helpers.expectThrow(
        registry.transferOwnership(hacker, { from: owner })
      );
      await registry.transferOwnership(hacker, { from: newOwner });
    });
  });

  describe('replaceService', () => {
    let newService;

    beforeEach(async () => {
      assert.equal(await registry.owner(), owner);
      assert.equal(await registry.service(), service.address);

      newService = await MockRegulatorService.new({ from: owner });
    });

    it('should allow the owner to replace the service with a contract', async () => {
      const event = registry.ReplaceService();

      await registry.replaceService(newService.address);
      assert.equal(await registry.service(), newService.address);

      await helpers.assertEvent(event, {
        oldService: service.address,
        newService: newService.address
      })
    });

    it('should NOT allow an invalid address', async () => {
      await helpers.expectThrow(registry.replaceService(participant));
      await helpers.expectThrow(registry.replaceService(0));
      assert.equal(await registry.service(), service.address);
    });

    it('should NOT allow anybody except for the owner to replace the service', async () => {
      await helpers.expectThrow(
        registry.replaceService(newService.address, { from: hacker })
      );
      assert.equal(await registry.service(), service.address);
    });
  });
});