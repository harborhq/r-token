pragma solidity ^0.4.15;

contract RegulatorService {
  function check(address _token, address _from, address _to, uint256 _amount) constant returns (bool);
}
