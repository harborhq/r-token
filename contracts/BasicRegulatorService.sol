pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatorService.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract BasicRegulatorService is RegulatorService, Ownable {
  uint constant FACT_KYC = 1;
  uint constant FACT_AML = 2;
  uint constant FACT_ACCRED = 3;

  mapping (address => mapping (uint => bool)) store;

  function get(address _address, uint256 _fact) constant returns (bool) {
    return store[_address][_fact];
  }

  function put(address _address, uint256 _fact, bool _value) onlyOwner {
    require(_address != address(0));
    store[_address][_fact] = _value;
  }

  function check(address, address, address _to, uint256) constant returns (bool) {
    require(_to != address(0));

    return store[_to][FACT_KYC] &&
           store[_to][FACT_AML] &&
           store[_to][FACT_ACCRED];
  }
}
