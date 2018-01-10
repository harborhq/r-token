pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import './ServiceRegistry.sol';
import './RegulatorService.sol';

/// @notice An ERC-20 token that has the ability to check for trade validity
contract RegulatedToken is MintableToken {

  /**
   * @notice Triggered when regulator checks pass or fail
   */
  event CheckStatus(uint8 reason);

  /**
   * @notice Address of the `ServiceRegistry` that has the location of the
   *         `RegulatorService` contract responsible for checking trade
   *         permissions.
   */
  ServiceRegistry public registry;

  /**
   * @notice Constructor
   *
   * @param _registry Address of `ServiceRegistry` contract
   */
  function RegulatedToken(address _registry) public {
    registry = ServiceRegistry(_registry);
  }

  /**
   * @notice The max precision for a partial token
   */
  function decimals() pure public returns (uint8) {
    return 18;
  }

  /**
   * @notice Returns whether or not this token is regulated
   *
   * @return `true` if regulated and `false` if not regulated
   */
  function isRegulated() constant public returns (bool) {
    return registry != address(0);
  }

  /**
   * @notice ERC-20 overridden function that include logic to check for trade validity.
   *
   * @param _to The address of the receiver
   * @param _value The number of tokens to transfer
   *
   * @return `true` if successful and `false` if unsuccessful
   */
  function transfer(address _to, uint256 _value) public returns (bool) {
    if (!_check(msg.sender, _to, _value)) {
      return false;
    }

    return super.transfer(_to, _value);
  }

  /**
   * @notice ERC-20 overridden function that include logic to check for trade validity.
   *
   * @param _from The address of the sender
   * @param _to The address of the receiver
   * @param _value The number of tokens to transfer
   *
   * @return `true` if successful and `false` if unsuccessful
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    if (!_check(_from, _to, _value)){
      return false;
    }

    return super.transferFrom(_from, _to, _value);
  }

  /**
   * @notice Performs the regulator check
   *
   * @dev This method raises a CheckStatus event indicating success or failure of the check
   *
   * @param _from The address of the sender
   * @param _to The address of the receiver
   * @param _value The number of tokens to transfer
   *
   * @return `true` if the check was successful and `false` if unsuccessful
   */
  function _check(address _from, address _to, uint256 _value) private returns (bool) {
    var reason = _service().check(this, _from, _to, _value);

    CheckStatus(reason);

    return reason == 0;
  }

  /**
   * @notice Retreives the address of the `RegulatorService` that manages this token.
   *
   * @dev This function *MUST NOT* memoize the `RegulatorService` address.  This would
   *      break the ability to upgrade the `RegulatorServuce`.
   *
   * @return The `RegulatorService` that manages this token.
   */
  function _service() constant public returns (RegulatorService) {
    return RegulatorService(registry.service());
  }
}