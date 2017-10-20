pragma solidity ^0.4.15;

import './RegulatorService.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @notice A service that points to a `RegulatorService`
contract ServiceRegistry is Ownable {
  address public service;

  /**
   * @notice Constructor
   *
   * @param _service The address of the `RegulatorService`
   *
   */
  function ServiceRegistry(address _service) {
    service = _service;
  }

  /**
   * @notice Replaces the address pointer to the `RegulatorService`
   *
   * @dev This method is only callable by the contract's owner
   *
   * @param _service The address of the new `RegulatorService`
   */
  function replaceService(address _service) onlyOwner {
    require(_service != address(0));
    service = _service;
  }
}