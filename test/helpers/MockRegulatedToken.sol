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

import '../../contracts/RegulatedToken.sol';
import '../../contracts/RegulatorService.sol';

contract MockRegulatedToken is RegulatedToken {
  RegulatorService public service;
  uint public decimals;

  // 0xffffffff is a test address for ServiceRegistry that is bypassed by our _service() implementation
  function MockRegulatedToken(address _service) public
    RegulatedToken(ServiceRegistry(0xffffffff), "MockToken", "MTKN")
  {
    service = RegulatorService(_service);
  }

  function setDecimals(uint _decimals) public {
    decimals = _decimals;
  }

  function _service() constant public returns (RegulatorService) {
    return service;
  }
}
