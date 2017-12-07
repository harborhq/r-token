pragma solidity ^0.4.18;

import '../../contracts/RegulatedToken.sol';
import '../../contracts/RegulatorService.sol';

contract MockRegulatedToken is RegulatedToken {
  RegulatorService public service;
  uint public decimals;

  function MockRegulatedToken(address _service) RegulatedToken(0) public {
    service = RegulatorService(_service);
  }

  function setDecimals(uint _decimals) public {
    decimals = _decimals;
  }

  function _service() constant public returns (RegulatorService) {
    return service;
  }
}