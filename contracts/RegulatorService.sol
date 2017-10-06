pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract RegulatorService is Ownable {
  uint constant FACT_KYC = 1;
  uint constant FACT_AML = 2;
  uint constant FACT_ACCRED = 3;

  // TODO: Upgrade solidity and try using Fact key type
  mapping (address => mapping (uint => bool)) store;

  function get(address _address, uint _fact) returns (bool) {
    return store[_address][_fact];
  }

  function put(address _address, uint _fact, bool _value) onlyOwner {
    require(_address != address(0));
    store[_address][_fact] = _value;
  }

  function check(address _participant) returns (bool) {
    require(_participant != address(0));

    return store[_participant][FACT_KYC] &&
           store[_participant][FACT_AML] &&
           store[_participant][FACT_ACCRED];
  }
}
