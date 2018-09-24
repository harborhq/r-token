/**
   Copyright (c) 2017 Harbor Platform, Inc.

   Licensed under the Apache License, Version 2.0 (the “License”);
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an “AS IS” BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
