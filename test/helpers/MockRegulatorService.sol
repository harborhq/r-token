pragma solidity ^0.4.15;

import '../../contracts/RegulatorService.sol';

contract MockRegulatorService is RegulatorService  {
  bool public checkResult;

  function setCheckResult(bool result) {
    checkResult = result;
  }

  function check(address, address, address, uint256) constant returns (bool) {
    return checkResult;
  }
}