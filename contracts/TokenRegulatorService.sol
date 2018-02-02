pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegulatedToken.sol';
import './RegulatorService.sol';

/**
 * @title  On-chain RegulatorService implementation for approving trades
 * @author Bob Remeika
 */
contract TokenRegulatorService is RegulatorService, Ownable {
  /**
   * @dev Throws if called by any account other than the admin
   */
  modifier onlyAdmins() {
    require(msg.sender == admin || msg.sender == owner);
    _;
  }

  /// @dev Settings that affect token trading at a global level
  struct Settings {

    /**
     * @dev Toggle for locking/unlocking trades at a token level.
     *      The default state when this contract is created `false` (or locked)
     */
    bool unlocked;

    /**
     * @dev Toggle for allowing/disallowing fractional token trades at a token level.
     *      The default state when this contract is created `false` (or no partial
     *      transfers allowed).
     */
    bool partialTransfers;
  }

  // @dev Check success code
  uint8 constant private CHECK_SUCCESS = 0;

  // @dev Check error reason: Token is locked
  uint8 constant private CHECK_ELOCKED = 1;

  // @dev Check error reason: Token can not trade partial amounts
  uint8 constant private CHECK_EDIVIS = 2;

  // @dev Check error reason: Sender is not allowed to send the token
  uint8 constant private CHECK_ESEND = 3;

  // @dev Check error reason: Receiver is not allowed to receive the token
  uint8 constant private CHECK_ERECV = 4;

  /// @dev Permission bits for allowing a participant to send tokens
  uint8 constant private PERM_SEND = 0x1;

  /// @dev Permission bits for allowing a participant to receive tokens
  uint8 constant private PERM_RECEIVE = 0x2;

  // @dev Address of the administrator
  address public admin;

  /// @notice Permissions that allow/disallow token trades on a per token level
  mapping(address => Settings) settings;

  /// @notice Permissions that allow/disallow token trades on a per participant basis
  mapping(address => mapping(address => uint8)) participants;

  function TokenRegulatorService() public {
    admin = msg.sender;
  }

  /**
   * @notice Locks the ability to trade a token
   *
   * @dev    This method can only be called by this contract's owner
   *
   * @param  _token The address of the token to lock
   */
  function setLocked(address _token, bool _locked) onlyOwner public {
    settings[_token].unlocked = !_locked;
  }

  /**
   * @notice Allows the ability to trade a fraction of a token
   *
   * @dev    This method can only be called by this contract's owner
   *
   * @param  _token The address of the token to allow partial transfers
   */
  function setPartialTransfersEnabled(address _token, bool _enabled) onlyOwner public {
   settings[_token].partialTransfers = _enabled;
  }

  /**
   * @notice Sets the trade permissions for a participant on a token
   *
   * @dev    The `_permission` bits overwrite the previous trade permissions and can
   *         only be called by the contract's owner.  `_permissions` can be bitwise
   *         `|`'d together to allow for more than one permission bit to be set.
   *
   * @param  _token The address of the token
   * @param  _participant The address of the trade participant
   * @param  _permission Permission bits to be set
   */
  function setPermission(address _token, address _participant, uint8 _permission) onlyAdmins public {
    participants[_token][_participant] = _permission;
  }

  /**
   * @dev Allows the current admin to transfer control of the contract to a newAdmin.
   *
   * @param newAdmin The address to transfer ownership to.
   */
  function transferAdmin(address newAdmin) onlyOwner public {
    if (newAdmin != address(0)) {
      admin = newAdmin;
    }
  }

  /**
   * @notice Checks whether or not a trade should be approved
   *
   * @dev    This method calls back to the token contract specified by `_token` for
   *         information needed to enforce trade approval if needed
   *
   * @param  _token The address of the token to be transfered
   * @param  _from The address of the sender account
   * @param  _from The address of the receiver account
   * @param  _amount The quantity of the token to trade
   *
   * @return `true` if the trade should be approved and  `false` if the trade should not be approved
   */
  function check(address _token, address _from, address _to, uint256 _amount) constant public returns (uint8) {
    if (!settings[_token].unlocked) {
      return CHECK_ELOCKED;
    }

    if (participants[_token][_from] & PERM_SEND == 0) {
      return CHECK_ESEND;
    }

    if (participants[_token][_to] & PERM_RECEIVE == 0) {
      return CHECK_ERECV;
    }

    if (!settings[_token].partialTransfers && _amount % _wholeToken(_token) != 0) {
      return CHECK_EDIVIS;
    }

    return CHECK_SUCCESS;
  }

  /**
   * @notice Retrieves the whole token value from a token that this `RegulatorService` manages
   *
   * @param  _token The token address of the managed token
   *
   * @return The uint256 value that represents a single whole token
   */
  function _wholeToken(address _token) pure private returns (uint256) {
    return uint256(10)**RegulatedToken(_token).decimals();
  }
}
