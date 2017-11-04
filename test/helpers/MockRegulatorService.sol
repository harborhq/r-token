pragma solidity ^0.4.15;

import '../../contracts/RegulatorService.sol';

contract MockRegulatorService is RegulatorService  {
  bool public success;
  uint8 public reason;

  function setCheckResult(bool _success, uint8 _reason) {
    success = _success;
    reason = _reason;
  }

  function check(address, address, address, uint256) constant returns (bool, uint8) {
    return (success, reason);
  }
}