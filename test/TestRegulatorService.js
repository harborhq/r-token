const TestRegulatedToken = artifacts.require('./TestRegulatedToken.sol');
const ServiceRegistry = artifacts.require('./ServiceRegistry.sol');
const TestRegulatorService = artifacts.require('./TestRegulatorService.sol');
const checkResult = require('./helpers').checkResult;
const helperAssertBalances = require('./helpers').assertBalances;


const SUCCESS = 0;  /* 0  <= AMOUNT < 10 */
const ELOCKED = 1;  /* 10 <= AMOUNT < 20 */
const EDIVIS = 2;   /* 20 <= AMOUNT < 30 */
const ESEND = 3;    /* 30 <= AMOUNT < 40 */
const ERECV = 4;    /* 40 <= AMOUNT < 50 */

contract('TestRegulatorService', async accounts => {
  const owner = accounts[0];
  const spender = owner;
  const receiver = accounts[1];
  const fromOwner = { from: owner };

  let regulator;
  let token;
  let assertBalances;

  beforeEach(async () => {
    regulator = await TestRegulatorService.new({ from: owner });
    const registry = await ServiceRegistry.new(regulator.address);
    token = await TestRegulatedToken.new(registry.address, 'Test', 'TEST');
  });

  describe('check', () => {
    it('returns SUCCESS when amount is between zero and ten', async () => {
      assert.equal(await regulator.check.call(token.address, spender, owner, receiver, 1), SUCCESS);
    });

    it('returns ELOCKED when amount is between ten and twenty', async () => {
      assert.equal(await regulator.check.call(token.address, spender, owner, receiver, 11), ELOCKED);
    });

    it('returns EDIVIS when amount is between twenty and thirty', async () => {
      assert.equal(await regulator.check.call(token.address, spender, owner, receiver, 21), EDIVIS);
    });

    it('returns ESEND when amount is between thirty and forty', async () => {
      assert.equal(await regulator.check.call(token.address, spender, owner, receiver, 31), ESEND);
    });

    it('returns ERECV when amount is between forty and fifty', async () => {
      assert.equal(await regulator.check.call(token.address, spender, owner, receiver, 41), ERECV);
    });
  });

  describe('TestRegulatedToken.transfer() with TestRegulatorService.check()', () => {
    beforeEach(async () => {
      assertBalances = async (ownerBal, receiverBal) => {
        await helperAssertBalances(token, { [owner]: ownerBal, [receiver]: receiverBal });
      }

      await token.mint(owner, 100);
      await token.finishMinting();

      await assertBalances(100, 0);
    });

    describe('when the transfer is simulated to be NOT APPROVED by the regulator(by entering a transfer amount from 10-50)', () => {
      beforeEach(async () => {
        assert.isFalse(await checkResult(regulator, token.address, owner, owner, receiver, 15));
      });

      it('does NOT transfer tokens', async () => {
        await token.transfer(receiver, 15, fromOwner);
        await assertBalances(100, 0);
      });
    });

    describe('when the transfer is simulated to be APPROVED by the regulator(by entering a transfer amount from 0-10)', () => {
      beforeEach(async () => {
        assert.isTrue(await checkResult(regulator, token.address, owner, owner, receiver, 5));
      });

      it('transfers tokens', async () => {
        await token.transfer(receiver, 5, fromOwner);
        await assertBalances(95, 5);
      });
    });
  });
});
