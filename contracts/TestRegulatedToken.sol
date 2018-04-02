pragma solidity ^0.4.18;

import './RegulatedToken.sol';

/**
 * Anyone can mint() a TestRegulatedToken.
 */
contract TestRegulatedToken is RegulatedToken {
  function TestRegulatedToken(ServiceRegistry _registry, string _name, string _symbol) public
    RegulatedToken(_registry, _name, _symbol)
  {

  }
  /**
   * Override zeppelin.MingableToken.canMint() to let anyone mint.
   */
  modifier canMint() {
    _;
  }

  /**
   * Override zeppelin.MingableToken.mint() without onlyOwner modifier.
   */
  function mint(address _to, uint256 _amount) canMint public returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

  /**
   * Override zeppelin.MingableToken.finishMinting() so that owner can
   * never finish minting.
   */
  function finishMinting() onlyOwner canMint public returns (bool) {
    return false;
  }
}
