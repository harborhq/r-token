# Regulated Token System (R-Token)

Smart Contracts for applying regulatory compliance to tokenized securities issuance and trading

## Feedback

We would love your feedback.  Have questions, want to contribute, or have general comments?  Ping the team and join the conversation at https://gitter.im/harborhq.

## Description

R-Token is a permissioned token on the Ethereum blockchain, enabling token transfers to occur if and only if they are approved by an on-chain Regulator Service. The Regulator Service can be configured to meet relevant securities regulations, Know Your Customer (KYC) policies, Anti-Money Laundering (AML) requirements, tax laws, and more. Implemented with the correct configurations, the R-Token standard makes compliant transfers possible, both on exchanges and person to person, in ICOs and secondary trades, and across jurisdictions. R-Token enables ERC-20 tokens to be used for regulated securities.

## How It Works

R-Token implements ERC-20 methods `transfer()` and `transferFrom()` with an additional check to determine whether or not a transfer should be allowed to proceed. The implementation of `check()` can take many forms, but a default whitelist approach is implemented by `TokenRegulatorService`. Token and participant-level permissions, when used in different combinations, can be used to satisfy multiple regulatory exemptions. The `ServiceRegistry` is included as a mechanism to facilitate upgrading the R-Token check logic as rules change over time.

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
  * Routes the R-Token to the correct version of the Regulator Service


<p align="center">
  <img src="https://github.com/harborhq/r-token/raw/master/docs/images/component_diagram.png" width="500">
</p>

## Features

Upgradable, token-level trade permission and participant-level trade permissions.

* Configurable without code modification and need for more security auditing
* Upgradable so an owner/admin can change business logic as rules evolve over time
* An owner/admin can lock/unlock trading for a period of time
* An owner/admin can whitelist/blacklist partial token transfers
* An owner/admin can qualify/disqualify a trade participant from sending tokens
* An owner/admin can qualify/disqualify a trade participant from receiving tokens

### Upgradable

The `ServiceRegistry` is used to point many `RegulatedToken` smart contracts to a single `RegulatorService`. This setup is recommended so that rules and logic implemented by the `RegulatorService` can be upgraded by changing a single `RegulatorService` address held by the `ServiceRegistry`.

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

Token-level permissions include:

* `locked` - controls locking and unlocking of all token trades for a particular token
* `partialAmounts` - allows or disallows transfers of partial token amounts

Participant-level permissions include:

* `PERM_SEND` - permission for a participant to send a token to another account
* `PERM_RECV` - permission for a participant to receive a token from another account

## Administrative Roles / Contract Ownership

Administrative privileges on R-Token smart contracts are divided into two roles: `Owner` and `Admin`. We will continue to decentralize administration in future versions.

The privileges for each role are defined below:

|            | RegulatedToken  | ServiceRegistry                  | RegulatorService                                                  |
|:-----------|:--------------- |:-------------------------------- |:----------------------------------------------------------------- |
| Owner      | Can Mint        | Transfer Owner / Replace Service | Update Token-Level Settings / Transfer Ownership / Transfer Admin |
| Admin      | N/A             | N/A                              | Update Participant-Level Settings                                 |

#Developers
The R-Token project was created with [Truffle](http://truffleframework.com/) so all truffle commands will work.

##Setup
1. Install dependencies. `yarn install`
1. Pick a 12 word mnemonic and put this in your bash profile so you can launch ganache-cli with a consistent seed.
   ```
   export RTOKEN_DEVELOPMENT_MNEMONIC="YOUR_MNEMONIC_HERE"
   ```
1. Run ganache-cli so truffle commands will work.
   ```
   yarn test:ganache
   ```

## Run Unit Tests
```
truffle test
```

## Migrate contracts
```
truffle migrate
```

## TestRegulatedTokens
Normal R-Tokens should only be minted under carefully regulated conditions, such as an ICO. Normal R-Tokens also restrict `ERC20.transfer()` and `ERC20.transferFrom()` to ensure that trades comply with government regulations or other business needs.

TestRegulatedTokens can be minted by developers whenever they want.

Mint `100` `CPPR` tokens to address `0xd4afd5525ada1efa8ae661be1a0b373eb9e68498` on your local `development` environment(localhost:8545).
```
node scripts/mint_test_tokens.js development 100 CPPR 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498
```

Mint `100` `GOLD` tokens to address `0xd4afd5525ada1efa8ae661be1a0b373eb9e68498` on `kovan`.
```
node scripts/mint_test_tokens.js kovan 100 GOLD 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498
```

Developers can control if TestRegulatedTokens transfers succeed or fail by adjusting the transaction amount.
* Approved: 0 >= amount < 10
* Error, Token is locked: 10 >= amount < 20
* Error, Token is not divisible: 20 >= amount < 30
* Error, Sender cannot send: 30 >= amount < 40
* Error, Receiver cannot receive: 40 >= amount < 50
```
testToken.transfer(to, 5); // Approved
testToken.transfer(to, 15); // Rejected, Token is locked
testToken.transferFrom(from, to, 5); // Approved
testToken.transferFrom(from, to, 15); // Rejected, Token is locked
```
