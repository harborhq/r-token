/**
   Copyright (c) 2017 Harbor Platform, Inc.

   Licensed under the Apache License, Version 2.0 (the “License”);
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an “AS IS” BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const BigNumber = require('bignumber.js');

const helpers = require('./helpers');
const RegulatedToken = artifacts.require('./RegulatedToken.sol');
const ServiceRegistry = artifacts.require('./ServiceRegistry.sol');
const MockRegulatorService = artifacts.require('../test/helpers/MockRegulatorService.sol');

contract('RegulatedToken', async function(accounts) {
  let regulator;
  let token;
  let assertBalances;

  const owner = accounts[0];
  const receiver = accounts[1];

  const fromOwner = { from: owner };
  const fromReceiver = { from: receiver };

  beforeEach(async () => {
    regulator = await MockRegulatorService.new({ from: owner });

    const registry = await ServiceRegistry.new(regulator.address);

    token = await RegulatedToken.new(registry.address, 'Test', 'TEST');

    assertBalances = async (ownerBal, receiverBal) => {
      await helpers.assertBalances(token, { [owner]: ownerBal, [receiver]: receiverBal });
    }

    await token.mint(owner, 100);
    await token.finishMinting();

    await assertBalances(100, 0);
  });

  const assertCheckStatusEvent = async (event, params) => {
    const p = Object.assign({}, params, {
      reason: new BigNumber(params.reason),
      value: new BigNumber(params.value),
    });

    return helpers.assertEvent(event, p, (expected, actual) => {
      assert.equal(expected.reason.valueOf(), actual.reason.valueOf());
      assert.equal(expected.spender, actual.spender);
      assert.equal(expected.from, actual.from);
      assert.equal(expected.to, actual.to);
      assert.equal(expected.value.valueOf(), actual.value.valueOf());
    });
  };

  describe('constructor', () => {
    it('requires a non-zero registry argument', async () => {
      await helpers.expectThrow(RegulatedToken.new(0, 'TEST', 'Test'));
    });
  });

  describe('transfer', () => {
    describe('when the transfer is NOT approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(false, 255);
        assert.isFalse(await helpers.checkResult(regulator, token.address, owner, owner, receiver, 0));
        await assertBalances(100, 0);
      });

      it('returns false', async () => {
        assert.isFalse(await token.transfer.call(receiver, 100, fromOwner));
        await assertBalances(100, 0);
      });

      it('triggers a CheckStatus event and does NOT transfer funds', async () => {
        const event = token.CheckStatus();
        const value = 25;

        await token.transfer(receiver, value, fromOwner);
        await assertBalances(100, 0);
        await assertCheckStatusEvent(event, {
          reason: 255,
          spender: owner,
          from: owner,
          to: receiver,
          value,
        });
      });
    });

    describe('when the transfer is approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(true, 0);
        assert.isTrue(await helpers.checkResult(regulator, token.address, owner, owner, receiver, 0));
        await assertBalances(100, 0);
      });

      it('returns true', async () => {
        assert.isTrue(await token.transfer.call(receiver, 100, fromOwner));
        // note: calls don't modify state
        await assertBalances(100, 0);
      });

      it('triggers a CheckStatus event and transfers funds', async () => {
        const event = token.CheckStatus();
        const value = 25;

        await token.transfer(receiver, value, fromOwner);
        await assertBalances(75, value);
        await assertCheckStatusEvent(event, {
          reason: 0,
          spender: owner,
          from: owner,
          to: receiver,
          value,
        });
      });
    });
  });

  describe('transferFrom', () => {
    describe('when the transfer is NOT approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(false, 255);

        assert.isFalse(await helpers.checkResult(regulator, token.address, owner, owner, receiver, 0));
        await token.approve(receiver, 25, fromOwner);
        await assertBalances(100, 0);
      });

      it('returns false', async () => {
        assert.isFalse(await token.transferFrom.call(owner, receiver, 20, fromReceiver));
        await assertBalances(100, 0);
      });

      it('triggers a CheckStatus event and does NOT transfer funds', async () => {
        const event = token.CheckStatus();
        const value = 25;

        await token.transferFrom(owner, receiver, value, fromOwner);

        await assertBalances(100, 0);
        await assertCheckStatusEvent(event, {
          reason: 255,
          spender: owner,
          from: owner,
          to: receiver,
          value,
        });
      });
    });

    describe('when the transfer is approved by the regulator', () => {
      beforeEach(async () => {
        await regulator.setCheckResult(true, 0);

        assert.isTrue(await helpers.checkResult(regulator, token.address, owner, owner, receiver, 0));
        await token.approve(receiver, 25, fromOwner);
        await assertBalances(100, 0);
      });

      it('returns true', async () => {
        assert.isTrue(await token.transferFrom.call(owner, receiver, 25, fromReceiver));
        // note: calls don't modify state
        await assertBalances(100, 0);
      });

      it('triggers a CheckStatus event and transfers funds', async () => {
        const event = token.CheckStatus();
        const value = 20;

        await token.transferFrom(owner, receiver, 20, fromReceiver);
        await assertBalances(80, 20);
        await assertCheckStatusEvent(event, {
          reason: 0,
          spender: receiver,
          from: owner,
          to: receiver,
          value,
        });

        await token.transferFrom(owner, receiver, 5, fromReceiver);
        await assertBalances(75, 25);
      });
    });
  });
});
