pragma solidity ^0.4.21;

import '../../contracts/RegulatorService.sol';

contract MockRegulatorService is RegulatorService  {
  bool public success;
  uint8 public reason;

  function setCheckResult(bool _success, uint8 _reason) public {
    success = _success;
    reason = _reason;
  }

  function check(address, address, address, address, uint256) public returns (uint8) {
    return reason;
  }
}