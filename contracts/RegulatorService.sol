pragma solidity ^0.4.4;

contract RegulatorService {
  address public owner;

  // modifier restricted() {
  //   if (msg.sender == owner) _;
  // }

  function RegulatorService() {
    owner = msg.sender;
  }

  function check(address _participant) returns (bool) {
    return false;
  }
}