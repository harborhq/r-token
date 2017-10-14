pragma solidity ^0.4.15;

import '../../contracts/RegulatedToken.sol';
import '../../contracts/RegulatorService.sol';

contract MockRegulatedToken is RegulatedToken {
  RegulatorService public service;
  uint public decimals;

  function MockRegulatedToken(address _service) RegulatedToken(0) {
    service = RegulatorService(_service);
  }

  function setDecimals(uint _decimals) {
    decimals = _decimals;
  }

  function _service() constant returns (RegulatorService) {
    return service;
  }
}