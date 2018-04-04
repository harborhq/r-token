# TestRegulatedTokens
Normal R-Tokens should only be minted under carefully regulated conditions, such as an ICO. Normal R-Tokens also restrict `ERC20.transfer()` and `ERC20.transferFrom()` to ensure that trades comply with government regulations or other business needs.

TestRegulatedTokens can be minted by developers whenever they want.

Mint `100` `CPPR` tokens to address `0xd4afd5525ada1efa8ae661be1a0b373eb9e68498` on your local `development` environment(localhost:8545).
```
RTOKEN_DEVELOPMENT_MNEMONIC="your mnemonic here...." node scripts/mint_test_tokens.js development 100 CPPR 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498
```

Mint `100` `GOLD` tokens to address `0xd4afd5525ada1efa8ae661be1a0b373eb9e68498` on `kovan`.
```
RTOKEN_KOVAN_MNEMONIC="your mnemonic here...." node scripts/mint_test_tokens.js kovan 100 GOLD 0xd4afd5525ada1efa8ae661be1a0b373eb9e68498
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
