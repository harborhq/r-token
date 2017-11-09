# Regulated Token System (R-Token)

Smart Contracts to enforce secondary trade approval

## Description

The Regulated Token System is a general purpose ERC-20 token implementation that overrides token transfer methods to consult an on-chain database for trade approval.  It is designed to be programmed with simple rules that can be turned off and on by regulators that maintain regulatory compliance in various jurisdictions around the world.  Whereas most issuers create unique token smart contracts with small tweaks, the Regulated Token System is designed to be a flexible standard for issuing regulated securities without code modification usable by any issuer.

## Overview

How it works by overriding ERC-20 methods.

## Components

* *RegulatedToken* - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
* *ServiceRegistry* - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
* *RegulatorService* - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<p align="center">
  <img src="https://github.com/tatslabs/r-token/raw/bob/readme/docs/images/component_diagram.png" width="500">
</p>

## Features

Upgradable, token level trade permission, participant level trade permissions.

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

## Contributing

Contributions are accepted from all walks of life including aliens (especially green ones).  Just sign [this](https://example.com) to protect our project so that others can use it in their projects with piece of mind.  Submissions will only be accepted after a Contributor's License Agreement (CLA) has been signed.

## Collaborators

* foobarfighter
* arisa
* bonninator


