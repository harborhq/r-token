pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatedToken.sol';
import './RegulatorService.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract TokenRegulatorService is RegulatorService, Ownable {
  struct Settings {
    bool unlocked;
    bool partialTransfers;
  }

  uint8 constant private PERM_SEND = 0x1;
  uint8 constant private PERM_RECEIVE = 0x2;

  mapping(address => Settings) settings;
  mapping(address => mapping(address => uint8)) participants;

  function lock(address _token) onlyOwner {
    settings[_token].unlocked = false;
  }

  function unlock(address _token) onlyOwner {
    settings[_token].unlocked = true;
  }

  function allowPartialTransfers(address _token) onlyOwner {
   settings[_token].partialTransfers = true;
  }

  function disallowPartialTransfers(address _token) onlyOwner {
   settings[_token].partialTransfers = false;
  }

  function setPermission(address _token, address _participant, uint8 _permission) onlyOwner {
    participants[_token][_participant] = _permission;
  }

  function check(address _token, address _from, address _to, uint256 _amount) constant returns (bool) {
    return settings[_token].unlocked
           && participants[_token][_from] & PERM_SEND > 0
           && participants[_token][_to] & PERM_RECEIVE > 0
           && (settings[_token].partialTransfers || _amount % 10**_decimals(_token) == 0);
  }

  function _decimals(address _token) constant private returns (uint256) {
    return RegulatedToken(_token).decimals();
  }
}
