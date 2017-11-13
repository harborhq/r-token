# Regulated Token System (R-Token)

Smart Contracts to enforce secondary trade approval

## Description

R-token is a permissioned token on the Ethereum blockchain, enabling token transfers to occur if and only if they are approved by an on-chain Regulator Service. Implemented in conjunction with an off-chain Trade Controller and proper customer due diligence, R-Tokens make possible for the first time the enforcement of regulations governing the transfer of private securities on the blockchain, for ICOs and every secondary trade.

## Overview

R-token implements ERC-20 methods `transfer()` and `transferFrom()` with an additional check that executes logic as to
whether or not a transfer is approved.  The implementation of the check can take many forms. Included in this repository
is a whitelisting approach designed to keep tokens compliant under Regulation S and Regulation D.  The `ServiceRegistry`
is also included as a method for upgrading the R-token check logic as rules are likely to change over time.

## Components

* RegulatedToken
  1. Permissioned ERC-20 smart contract representing ownership of securities 
  2. Compatible with existing wallets and exchanges that support the ERC-20 token standard
  3. Overrides the existing ERC-20 transfer method to check with an on-chain Regulator Service for trade approval
* RegulatorService
  1. Contains the permissions necessary for regulatory compliance 
  2. Relies on off-chain trade approver to set and update permissions
* ServiceRegistry
  1. Accounts for regulatory requirement changes over time 
  2. Routes the R-token to the correct version of the Regulator Service


<p align="center">
  <img src="https://github.com/tatslabs/r-token/raw/bob/readme/docs/images/component_diagram.png" width="500">
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

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<p align="center">
  <img src="https://github.com/tatslabs/r-token/raw/bob/readme/docs/images/upgradability.png" width="500">
</p>

### Permissions

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<p align="center">
  <img src="https://github.com/tatslabs/r-token/raw/bob/readme/docs/images/permissions.png" width="500">
</p>

## Ownership

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

| Left Aligned  | Center Aligned  | Right Aligned |
|:------------- |:---------------:| -------------:|
| col 3 is      | some wordy text |         $1600 |
| col 2 is      | centered        |           $12 |
| zebra stripes | are neat        |            $1 |

## Contributing

Contributions are accepted from all walks of life including aliens (especially green ones).  Just sign the [Contributor's License Agreement (CLA)](https://cla.github.com/agreement) to protect our project so that others can use it with piece of mind.  Submissions will only be accepted after a [Contributor's License Agreement (CLA)](https://cla.github.com/agreement) has been signed.

## Collaborators

* foobarfighter
* arisa
* bonninator


