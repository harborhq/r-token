// https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/test/helpers/expectThrow.js
exports.expectThrow = async promise => {
  try {
    await promise;
  } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    assert(invalidOpcode || outOfGas || revert, "Expected throw, got '" + error + "' instead");
    return;
  }
  assert.fail('Expected throw not received');
};

exports.assertEvent = (event, args, assertEqual = assert.deepEqual, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error('Timeout while waiting for event'));
    }, timeout);

    event.watch((error, response) => {
      try {
        assertEqual(response.args, args, 'Event argument mismatch');
        resolve(response);
      } finally {
        clearTimeout(t);
        event.stopWatching();
      }
    });
  });
};

/**
 * @return true if the regulator will allow the trade.
 */
exports.checkResult = async (regulator, tokenAddress, spender, sender, receiver, amount) => {
  const reason = await regulator.check.call(tokenAddress, spender, sender, receiver, amount);
  return reason == 0;
};

/**
 * Assert all addresses have the given balance for the given token.
 * @param token The token to check balances for.
 * @param balances Object where keys are addresses and values are the expected number of tokens for that address.
 */
exports.assertBalances = async (token, balances) => {
  for (let addr in balances) {
    const expectedBal = balances[addr];
    const actualBal = await token.balanceOf.call(addr);
    assert.equal(actualBal.toNumber(), expectedBal);
  }
};
