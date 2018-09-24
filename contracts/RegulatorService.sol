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

/// @notice Standard interface for `RegulatorService`s
contract RegulatorService {

  /*
   * @notice This method *MUST* be called by `RegulatedToken`s during `transfer()` and `transferFrom()`.
   *         The implementation *SHOULD* check whether or not a transfer can be approved.
   *
   * @dev    This method *MAY* call back to the token contract specified by `_token` for
   *         more information needed to enforce trade approval.
   *
   * @param  _token The address of the token to be transfered
   * @param  _spender The address of the spender of the token
   * @param  _from The address of the sender account
   * @param  _to The address of the receiver account
   * @param  _amount The quantity of the token to trade
   *
   * @return uint8 The reason code: 0 means success.  Non-zero values are left to the implementation
   *               to assign meaning.
   */
  function check(address _token, address _spender, address _from, address _to, uint256 _amount) public returns (uint8);
}
