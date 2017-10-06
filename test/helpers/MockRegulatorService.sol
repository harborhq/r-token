pragma solidity ^0.4.4;

import '../../contracts/RegulatorService.sol';

contract MockRegulatorService is RegulatorService  {
  bool public checkResult;

  function setCheckResult(bool result) {
    checkResult = result;
  }

  function check(address _participant) constant returns (bool) {
    return checkResult;
  }
}