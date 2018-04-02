const TestRegulatedToken = artifacts.require('./TestRegulatedToken.sol');
const ServiceRegistry = artifacts.require('./ServiceRegistry.sol');
const TestRegulatorService = artifacts.require('./TestRegulatorService.sol');

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
  const fromReceiver = { from: receiver };

  let regulator;
  let token;

  beforeEach(async () => {
    regulator = await TestRegulatorService.new({ from: owner });
    const registry = await ServiceRegistry.new(regulator.address);
    token = await TestRegulatedToken.new(registry.address, 'Test', 'TEST');
  });

  const assertBalances = async balances => {
    assert.equal(balances.owner, (await token.balanceOf.call(owner)).valueOf());
    assert.equal(balances.receiver, (await token.balanceOf.call(receiver)).valueOf());
  };

  const checkResult = async (tokenAddress, spender, sender, receiver, amount) => {
    const reason = await regulator.check.call(tokenAddress, spender, sender, receiver, amount);
    return reason == 0;
  };

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
      await token.mint(owner, 100);
      await token.finishMinting();

      await assertBalances({ owner: 100, receiver: 0 });
    });

    describe('when the transfer is simulated to be NOT APPROVED by the regulator(by entering a transfer amount from 10-50)', () => {
      beforeEach(async () => {
        await assertBalances({ owner: 100, receiver: 0 });
        assert.isFalse(await checkResult(token.address, owner, owner, receiver, 15));
      });

      it('returns false', async () => {
        await token.transfer(receiver, 15, fromOwner);
        await assertBalances({ owner: 100, receiver: 0 });
      });
    });

    describe('when the transfer is simulated to be APPROVED by the regulator(by entering a transfer amount from 0-10)', () => {
      beforeEach(async () => {
        await assertBalances({ owner: 100, receiver: 0 });
        assert.isTrue(await checkResult(token.address, owner, owner, receiver, 5));
      });

      it('returns false', async () => {
        await token.transfer(receiver, 5, fromOwner);
        await assertBalances({ owner: 95, receiver: 5 });
      });
    });
  });
});
