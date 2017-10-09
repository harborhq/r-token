pragma solidity ^0.4.15;

contract RegulatorService {
  function get(address _address, uint _fact) constant returns (bool);
  function put(address _address, uint _fact, bool _value);
  function check(address _participant) constant returns (bool);
}
