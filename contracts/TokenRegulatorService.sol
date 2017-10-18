pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatedToken.sol';
import './RegulatorService.sol';

/// @title  On-chain RegulatorService implementation for approving trades
/// @author Bob Remeika
contract TokenRegulatorService is RegulatorService, Ownable {

  /// @dev Settings that affect token trading at a global level
  struct Settings {
    /// @dev Toggle for locking/unlocking trades at a token level.
    ///      The default state when this contract is created `false` (or locked)
    bool unlocked;

    /// @dev Toggle for allowing/disallowing fractional token trades at a token level.
    ///      The default state when this contract is created `false` (or no partial
    ///      transfers allowed).
    bool partialTransfers;
  }

  /// @dev Permission bits for allowing a participant to send tokens
  uint8 constant private PERM_SEND = 0x1;

  /// @dev Permission bits for allowing a participant to receive tokens
  uint8 constant private PERM_RECEIVE = 0x2;

  /// @dev Permissions that allow/disallow token trades on a per token level
  mapping(address => Settings) settings;

  /// @dev Permissions that allow/disallow token trades on a per participant basis
  mapping(address => mapping(address => uint8)) participants;

  /// @notice Globally locks the ability to trade a token
  /// @dev    This method can only be called by this contract's owner
  /// @param  _token The address of the token to lock
  function lock(address _token) onlyOwner {
    settings[_token].unlocked = false;
  }

  /// @notice Globally unlocks the ability to trade a token
  /// @dev    This method can only be called by this contract's owner
  /// @param  _token The address of the token to lock
  function unlock(address _token) onlyOwner {
    settings[_token].unlocked = true;
  }

  /// @notice Globally allows the ability to trade a fraction of a token
  /// @dev    This method can only be called by this contract's owner
  /// @param  _token The address of the token to allow partial transfers
  function allowPartialTransfers(address _token) onlyOwner {
   settings[_token].partialTransfers = true;
  }

  /// @notice Globally disallows the ability to trade a fraction of a token
  /// @dev    This method can only be called by this contract's owner
  /// @param  _token The address of the token to allow partial transfers
  function disallowPartialTransfers(address _token) onlyOwner {
   settings[_token].partialTransfers = false;
  }

  /// @notice Sets the trade permissions for a participant on a token
  /// @dev    The `_permission` overwrites the previous trade permissions and can
  ///         only be called by the contract's owner.  _permissions can be bitwise
  ///         `|` together to allow for more than one permission to be set.
  /// @param  _token The address of the token
  /// @param  _participant The address of the trade participant
  /// @param  _permission
  function setPermission(address _token, address _participant, uint8 _permission) onlyOwner {
    participants[_token][_participant] = _permission;
  }

  /// @notice Checks whether or not a trade should be approved
  /// @dev    This method calls back to the token contract specified by `_token` for
  ///         information needed to enforce trade approval.
  /// @param  _token The address of the token to be transfered
  /// @param  _from The address of the sender account
  /// @param  _from The address of the receiver account
  /// @param  _amount The quantity of the token to trade
  /// @returns `true` if the trade should be approved and  `false` if the trade should not be approved
  function check(address _token, address _from, address _to, uint256 _amount) constant returns (bool) {
    return settings[_token].unlocked
           && participants[_token][_from] & PERM_SEND > 0
           && participants[_token][_to] & PERM_RECEIVE > 0
           && (settings[_token].partialTransfers || _amount % 10**_decimals(_token) == 0);
  }

  /// @notice Retrieve the `decimals` setting from a token that this `RegulatorService` manages
  /// @param  _token The token address of the managed token
  /// @returns The number of decimals
  function _decimals(address _token) constant private returns (uint256) {
    return RegulatedToken(_token).decimals();
  }
}
