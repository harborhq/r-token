var helpers = require("./helpers");
var MockRegulatedToken = artifacts.require("../test/helpers/MockRegulatedToken.sol");
var TokenRegulatorService = artifacts.require("./TokenRegulatorService.sol");

const PERM_NONE = 0x0;
const PERM_SEND = 0x1;
const PERM_RECEIVE = 0x2;
const PERM_TRANSFER = PERM_SEND | PERM_RECEIVE;

const ENONE = 0;
const ELOCKED = 1;
const EDIVIS = 2;
const ESEND = 3;
const ERECV = 4;

contract('TokenRegulatorService', async (accounts) => {
  let owner, account, token, service;

  beforeEach(async () => {
    owner = accounts[0];
    admin = accounts[1]
    account = accounts[2];
    other = accounts[3];

    service = await TokenRegulatorService.new({ from: owner });
    token = await MockRegulatedToken.new();
  });

  const onlyOwner = (method, producer) => {
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

  const assertResult = (ret, success, reason) => {
    assert.equal(ret, reason, 'Assert reason');
  }

  describe('permissions', () => {
    onlyOwner('setLocked', () => { return [service, token.address, true] });
    onlyOwner('setPartialTransfersEnabled', () => { return [service, token.address, true] });
    onlyOwner('setPermission', () => { return [service, token.address, account, 0] });
    onlyOwner('transferAdmin', () => { return [service, account] });

    describe('setPermission', () => {
      beforeEach(async () => {
        await service.transferAdmin(admin);
      });

      it('allows admin to invoke', async () => {
        await service.setPermission.call(0, account, 0, { from: admin });
        await helpers.expectThrow(
          service.setPermission.call(0, account, 0, { from: other })
        );
      });
    });

    describe('default roles', () => {
      it('defaults the owner as the creator of the contract', async () => {
        const currentOwner = await service.owner();
        assert.equal(owner, currentOwner);
      });

      it('defaults the admin as the creator of the contract', async () => {
        const currentAdmin = await service.admin();
        assert.equal(owner, currentAdmin);
      });
    });
  });

  describe('locking', () => {
    beforeEach(async () => {
      await service.setPermission(token.address, owner, PERM_TRANSFER);
      await service.setPermission(token.address, account, PERM_TRANSFER);
    });

    it('is locked by default', async () => {
      assertResult(await service.check.call(token.address, owner, account, 0), false, ELOCKED);
    });

    it('toggles the ability to trade', async () => {
      assertResult(await service.check.call(token.address, owner, account, 0), false, ELOCKED);
      await service.setLocked(token.address, false);
      assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);
      await service.setLocked(token.address, true);
      assertResult(await service.check.call(token.address, owner, account, 0), false, ELOCKED);
    });
  });

  describe('partial trades', () => {
    beforeEach(async () => {
      await service.setLocked(token.address, false);
      await service.setPermission(token.address, owner, PERM_TRANSFER);
      await service.setPermission(token.address, account, PERM_TRANSFER);

      const decimals = 4,
            expectedTotalSupply = 2000 * 10**decimals;

      await token.setDecimals(decimals);
      await token.mint(owner, expectedTotalSupply);

      assert.equal(expectedTotalSupply, await token.totalSupply.call());

      assertResult(await service.check.call(token.address, owner, account, 10001111), false, EDIVIS);
    });

    describe('when partial trades are allowed', async () => {
      it('allows fractional trades', async () => {
        await service.setPartialTransfersEnabled(token.address, true);
        assertResult(await service.check.call(token.address, owner, account, 10001111), true, ENONE);
        assertResult(await service.check.call(token.address, owner, account, 10000000), true, ENONE);
      });
    });

    describe('when partial trades are NOT allowed', async () => {
      it('does NOT allow fractional trades', async () => {
        await service.setPartialTransfersEnabled(token.address, false);
        assertResult(await service.check.call(token.address, owner, account, 10000000), true, ENONE);
        assertResult(await service.check.call(token.address, owner, account, 10001111), false, EDIVIS);
      });
    });
  });

  describe('permissions', async () => {
    beforeEach(async () => {
      await service.setLocked(token.address, false);
    });

    describe('when granular permissions are used', () => {
      it('requires a sender to have send permissions', async () => {
        await service.setPermission(token.address, owner, PERM_SEND);
        await service.setPermission(token.address, account, PERM_RECEIVE);

        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);

        await service.setPermission(token.address, owner, PERM_RECEIVE);
        await service.setPermission(token.address, account, PERM_RECEIVE);

        assertResult(await service.check.call(token.address, owner, account, 0), false, ESEND);
      });

      it('requires a receiver to have receive permissions', async () => {
        await service.setPermission(token.address, owner, PERM_SEND);
        await service.setPermission(token.address, account, PERM_RECEIVE);

        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);

        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_SEND);

        assertResult(await service.check.call(token.address, owner, account, 0), false, ERECV);
      });
    });

    describe('when a participant does not exist', () => {
      beforeEach(async () => {
        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_TRANSFER);
        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);
      });

      it('denies trades', async () => {
        assertResult(await service.check.call(token.address, owner, '0x0', 0), false, ERECV);
        assertResult(await service.check.call(token.address, '0x0', owner, 0), false, ESEND);
      });
    });

    describe('when both participants are eligible', () => {
      beforeEach(async () => {
        await service.setPermission(token.address, owner, PERM_NONE);
        await service.setPermission(token.address, account, PERM_NONE);
        assertResult(await service.check.call(token.address, owner, account, 0), false, ESEND);
      });

      it('allows trades', async () => {
        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_TRANSFER);
        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);
      });
    });

    describe('when one participant is ineligible', () => {
      beforeEach(async () => {
        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_TRANSFER);
        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);
      });

      it('prevents trades', async () => {
        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_NONE);

        assertResult(await service.check.call(token.address, owner, account, 0), false, ERECV);

        await service.setPermission(token.address, owner, PERM_NONE);
        await service.setPermission(token.address, account, PERM_TRANSFER);

        assertResult(await service.check.call(token.address, owner, account, 0), false, ESEND);
      });
    });

    describe('when no participants are eligible', () => {
      beforeEach(async () => {
        await service.setPermission(token.address, owner, PERM_TRANSFER);
        await service.setPermission(token.address, account, PERM_TRANSFER);
        assertResult(await service.check.call(token.address, owner, account, 0), true, ENONE);
      });

      it('prevents trades', async () => {
        await service.setPermission(token.address, owner, PERM_NONE);
        await service.setPermission(token.address, account, PERM_NONE);
        assertResult(await service.check.call(token.address, owner, account, 0), false, ESEND);
      });
    });
  });
});
