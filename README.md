# Regulated Token System (r-token)

Smart Contracts to enfore trade approval

## Abstract

The Regulated Token System is a general purpose ERC-20 token implementation that overrides token transfer methods to consult an on-chain database for trade approval.  It is designed to be programmed with simple rules that can be turned off and on by regulators that maintain regulatory compliance in various jurisdictions around the world.  Whereas most issuers create unique token smart contracts with small tweaks, the Regulated Token System is designed to be a flexible standard for issuing regulated securities without code modification usable by any issuer.

## Components

* RegulatedToken
* ServiceRegistry
* RegulatorService

![Component Diagram](https://github.com/tatslabs/r-token/raw/bob/readme/docs/images/component_diagram.png)

## System Requirements

* Allow regulators to change business logic as rules evolve over time
* Allow a regulator to lock/unlock trading for a period of time
* Allow a regulator to allow/disallow partial token transfers
* Allow a regulator to qualify/disqualify a trade participant from sending tokens
* Allow a regulator to qualify/disqualify a trade participant from receiving tokens
* Reusable by any issuer without code modification and need for more security auditing
* The token cap table must be retrievable at all times
* Point in time token ownership reporting
* Leave open the possibility for more than one regulator to exist
* Dividend disbursement
