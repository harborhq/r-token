# Regulated Token System (R-token)

Smart Contracts for enforcing regulated trade compliance

## Description

R-token is a permissioned token on the Ethereum blockchain, enabling token transfers to occur if and only if they are approved by an on-chain Regulator Service. Implemented in conjunction with an off-chain Trade Controller and proper customer due diligence, R-Tokens make possible for the first time the enforcement of regulations governing the transfer of private securities on the blockchain, for ICOs and every secondary trade.

## How It Works

R-token implements ERC-20 methods `transfer()` and `transferFrom()` with an additional check to determine whether or not a transfer should be allowed to proceed. The implementation of `check()` can take many forms, but a default whitelist approach is implemented by `TokenRegulatorService`. Token and participant level permissions, when used in different combinations, can be used to satisfy multiple regulatory exemptions. The `ServiceRegistry` is included as a mechanism to facilitate upgrading the R-token check logic as rules change over time.

## Components

* RegulatedToken
  * Permissioned ERC-20 smart contract representing ownership of securities
  * Compatible with existing wallets and exchanges that support the ERC-20 token standard
  * Overrides the existing ERC-20 transfer method to check with an on-chain Regulator Service for trade approval
* RegulatorService
  * Contains the permissions necessary for regulatory compliance
  * Relies on off-chain trade approver to set and update permissions
* ServiceRegistry
  * Accounts for regulatory requirement changes over time
  * Routes the R-token to the correct version of the Regulator Service


<p align="center">
  <img src="https://github.com/harborhq/r-token/raw/master/docs/images/component_diagram.png" width="500">
</p>

## Features

Upgradable, token level trade permission and participant level trade permissions.

* Configurable without code modification and need for more security auditing
* Upgradable so regulator can change business logic as rules evolve over time
* Regulator can lock/unlock trading for a period of time
* Regulator can whitelist/blacklist partial token transfers
* Regulator can qualify/disqualify a trade participant from sending tokens
* Regulator can qualify/disqualify a trade participant from receiving tokens

### Upgradable

The `ServiceRegistry` is used to point many `RegulatedToken` smart contracts to a single `RegistryService`. This setup is recommended so that rules and logic implemented by the `RegulatorService` can be upgraded by changing a single `RegulatorService` address held by the `ServiceRegistry`.

<p align="center">
  <img src="https://github.com/harborhq/r-token/raw/master/docs/images/upgradability.png" width="500">
</p>


When `RegulatorService` logic needs to be updated, the migration path resembles a process like this:

1. Deploy new RegulatorService (V2)
2. Copy required state from Regulator Service V1 to RegulatorService V2
3. Call `replaceService()` on `ServiceRegistry` with address pointing to RegulatorService V2

### Token/Participant Level Permissions

In the `TokenRegulatorService` implementation of the `RegulatorService` interface, there are token level permissions and participant level permissions. These permissions should be updated by an off-chain process like shown below:

<p align="center">
  <img src="https://github.com/harborhq/r-token/raw/master/docs/images/permissions.png" width="500">
</p>

Token level permissions include:

* `unlocked` - controls locking and unlocking of all token trades for a particular token
* `partialAmounts` - allows or disallows transfers of partial token amounts

Participant level permissions include:

* `PERM_SEND` - permission for a participant to send a token to another account
* `PERM_RECV` - permission for a participant to receive a token from another account


### Wallet Compatibility

The `RegulatedToken` is compatible with ERC-20 wallets with one additional feature. After `transfer()` or `transferFrom()` are called, a `CheckStatus` event is fired. A `CheckStatus` event with a reason code of `0` indicates success. A non-zero reason code indicates a failure with a reason code that is specific to the `RegulatorService` implementation.


## Administrative Roles / Contract Ownership

Administrative privileges on R-token smart contracts are divided into two roles: `Owner` and `Admin`. We will continue to decentralize administration in future versions.

The privileges for each role are defined below:

|            | RegulatedToken  | ServiceRegistry                  | RegulatorService                                                  |
|:-----------|:--------------- |:-------------------------------- |:----------------------------------------------------------------- |
| Owner      | Can Mint        | Transfer Owner / Replace Service | Update Token Level Settings / Transfer Ownership / Transfer Admin |
| Admin      | N/A             | N/A                              | Update Participant Level Settings                                 |


## Collaborators

* foobarfighter
* arisa
* bonninator
