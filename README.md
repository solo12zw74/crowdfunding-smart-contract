# crowdfunding-smart-contract
This repository is for the Developing Applications on Ethereum course from Pluralsight

## Crowdfunding smart contract and application

The idea of the application is emulate the work of crowdfunding platform in Ethereum blockchain.
Crowdfunding.
Roles of the application:
- Author
- People (crowd)

Contract limitations;
- contract limited by lifetime

## Known challenges, problems

| Problem            | Solution                    | Result                         |
| ------------------ | --------------------------- | ------------------------------ |
| Get current time   | Get get `block.timestamp`   | Get the block generation time  |
| Conversion of time | Use `1 minute`, `1 hour`    | Covert the unit to millisecods |
| ETH denominations  | Use `20 finney`, `10 ether` | Covert the unit WEI            |