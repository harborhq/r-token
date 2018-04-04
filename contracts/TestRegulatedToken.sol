pragma solidity ^0.4.18;

import './RegulatedToken.sol';

/**
 * TestRegulatedToken is a RegulatedToken meant for testing purposes.
 * Developers can mint an unlimited number of TestRegulatedTokens.
 * TestRegulatedToken is meant to be instantiated with a ServiceRegistry
 * that points to an instance of TestRegulatorService.
 */
contract TestRegulatedToken is RegulatedToken {
  function TestRegulatedToken(ServiceRegistry _registry, string _name, string _symbol) public
    RegulatedToken(_registry, _name, _symbol)
  {

  }

  /**
   * Override zeppelin.MintableToken.mint() without onlyOwner or canMint modifiers.
   */
  function mint(address _to, uint256 _amount) public returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }
}
