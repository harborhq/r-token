pragma solidity ^0.4.15;

import './RegulatorService.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract ServiceRegistry is Ownable {
  address public service;

  function ServiceRegistry(address _service) {
    service = _service;
  }

  function replaceService(address _service) onlyOwner {
    require(_service != address(0));
    service = _service;
  }
}