pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatorService.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract TokenRegulatorService is RegulatorService, Ownable {
  mapping (address => mapping (address => bool)) store;

  function get(address _token, uint256 _fact) constant returns (bool) {
    // PARANOID: Argument checking?
    var participant = address(_fact); // PARANOID: Is there a better way to do this?

    return store[_token][participant];
  }

  // PARANOID: Should onlyOwner be included in a base class
  function put(address _token, uint256 _fact, bool _value) onlyOwner {
    // PARANOID: Argument checking?
    var participant = address(_fact); // PARANOID: Is there a better way to do this?

    store[_token][participant] = _value;
  }

  function check(address _token, address, address _to, uint256) constant returns (bool) {
    // PARANOID: Argument checking?
    return store[_token][_to];
  }
}
