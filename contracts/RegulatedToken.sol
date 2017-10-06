pragma solidity ^0.4.4;

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

  function isRegulated() returns (bool) {
    return registry != address(0);
  } 

  function transfer(address _to, uint256 _value) returns (bool) {
    require(registry != address(0));

    var service = RegulatorService(registry.service());
    if (!service.check(_to))
      revert();

    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    // require(eligible[_from] && eligible[_to]);
    return super.transferFrom(_from, _to, _value);
  }
}