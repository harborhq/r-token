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
    let t = setTimeout(() => {
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
