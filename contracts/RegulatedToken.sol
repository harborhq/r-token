pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';
import './RegulatorService.sol';

contract RegulatedToken is MintableToken {

  address public owner;
  address public regulator;

  event RegulatorRegistered(address _regulator);

  function RegulatedToken(address _regulator) {
    regulator = _regulator;
  }

  function isRegulated() returns (bool) {
    return regulator != address(0);
  } 

  function transfer(address _to, uint256 _value) returns (bool) {
    require(regulator != address(0));
    require(RegulatorService(regulator).check(_to));

    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    // require(eligible[_from] && eligible[_to]);
    return super.transferFrom(_from, _to, _value);
  }
}