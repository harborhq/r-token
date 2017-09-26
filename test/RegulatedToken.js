var helpers = require("./helpers");
var RegulatedToken = artifacts.require("./RegulatedToken.sol");
var RegulatorService = artifacts.require("./RegulatorService.sol");

contract('RegulatedToken', async function(accounts) {
  let regulator, token;
  let owner, receiver, hacker;

  beforeEach(async () => {
    owner = accounts[0];
    receiver = accounts[1];
    hacker = accounts[2];

    regulator = await RegulatorService.new({ from: owner });

    token = await RegulatedToken.new({ from: owner });
    await token.mint(owner, 100);
    await token.finishMinting();

    assert.equal(await token.balanceOf.call(owner), 100);
  });

  describe('registration', () => {
    it('only allows owners to register the RegulatorService', async () => {
      assert.isFalse(await token.isRegistered.call());

      await helpers.expectThrow(
        token.register(regulator.address, { from: hacker })
      )

      // TODO: Listen for registration event
      // await helpers.listenFor('RegulatorRegistered',
      //   token.register(regulator.address, { from: hacker })
      // )
    });
  });

  describe('transfer', () => {
    it('throws when there is no regulator', async () => {
      assert.isFalse(await token.isRegistered.call());
      assert.isTrue(await regulator.check.call(receiver));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('throws when the receiver is not approved by the regulator', async () => {
      await token.register(regulator.address, { from: owner })

      assert.isTrue(await token.isRegistered.call());
      assert.isFalse(await regulator.check.call(receiver));

      await helpers.expectThrow(
        token.transfer(receiver, 100)
      );
    });

    it('succeeds when the trade is approved by the regulator', async () => {
      await token.register(regulator.address, { from: owner })

      assert.isTrue(await token.isRegistered.call());
      assert.isTrue(await regulator.check.call(receiver));
    });
  });
});