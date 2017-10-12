pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatorService.sol';

// PARANOID: Should we exclude the ability to transferOwnership?
contract TokenRegulatorService is RegulatorService, Ownable {
  struct Settings {
    bool unlocked;
  }

  mapping(address => Settings) settings;
  mapping(address => mapping(address => bool)) participants;

  function lock(address _token) onlyOwner {
    settings[_token].unlocked = false;
  }

  function unlock(address _token) onlyOwner {
    settings[_token].unlocked = true;
  }

  function setParticipation(address _token, address _participant, bool _eligible) onlyOwner {
    participants[_token][_participant] = _eligible;
  }

  function check(address _token, address _from, address _to, uint256) constant returns (bool) {
    return settings[_token].unlocked
           && participants[_token][_from]
           && participants[_token][_to];
  }
}
