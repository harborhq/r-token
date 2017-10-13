pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import './ServiceRegistry.sol';
import './RegulatorService.sol';

// PARANOID: Should this really be MintableToken
contract RegulatedToken is MintableToken {

  address public owner;
  ServiceRegistry public registry;

  function RegulatedToken(address _registry) {
    registry = ServiceRegistry(_registry);
  }

  function isRegulated() constant returns (bool) {
    return registry != address(0);
  }

  function transfer(address _to, uint256 _value) returns (bool) {
    require(_service().check(this, msg.sender, _to, _value));

    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    require(_service().check(this, _from, _to, _value));

    return super.transferFrom(_from, _to, _value);
  }

  function _service() private constant returns (RegulatorService) {
    return RegulatorService(registry.service());
  }
}