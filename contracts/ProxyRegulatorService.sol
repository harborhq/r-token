pragma solidity ^0.4.4;

import './RegulatorService.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract ProxyRegulatorService is Ownable {
  address public service;

  function ProxyRegulatorService(address _service) {
    service = _service;
  }

  function replaceService(address _service) onlyOwner {
    require(_service != address(0));
    service = _service;
  }

  function check(address _participant) returns (bool) {
    return RegulatorService(service).check(_participant);
  }
}