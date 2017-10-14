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

  mapping(address => Settings) settings;
  mapping(address => mapping(address => bool)) participants;

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

  function setParticipation(address _token, address _participant, bool _eligible) onlyOwner {
    participants[_token][_participant] = _eligible;
  }

  function check(address _token, address _from, address _to, uint256 _amount) constant returns (bool) {
    return settings[_token].unlocked
           && participants[_token][_from]
           && participants[_token][_to]
           && (settings[_token].partialTransfers || _amount % 10**_decimals(_token) == 0);
  }

  function _decimals(address _token) constant private returns (uint256) {
    return RegulatedToken(_token).decimals();
  }
}
