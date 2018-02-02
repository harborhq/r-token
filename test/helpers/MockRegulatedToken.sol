pragma solidity ^0.4.18;

import '../../contracts/RegulatedToken.sol';
import '../../contracts/RegulatorService.sol';

contract MockRegulatedToken is RegulatedToken {
  RegulatorService public service;
  uint public decimals;

  // 0xffffffff is a test address for ServiceRegistry that is bypassed by our _service() implementation
  function MockRegulatedToken(address _service) RegulatedToken(ServiceRegistry(0xffffffff)) public {
    service = RegulatorService(_service);
  }

  function setDecimals(uint _decimals) public {
    decimals = _decimals;
  }

  function _service() constant public returns (RegulatorService) {
    return service;
  }
}