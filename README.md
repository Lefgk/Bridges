
<br>

# Report

This project review contains an evaluation of a proposed project to stake assets in Masterchef and move them between pools to maximize rewards. The project involves moving a demo contract to MasterStrategy, linking Oracle to Strategy to require approval for fund movements.

### Requirements Gathering:
The first step is to figure out which pools to use for staking, including Stargate, anyswap/multiswap, and Celer. Any issue that could occur and any work around 

### Design:
The proposed design includes staking assets in Masterchef, moving the asset from Chief to Strategy, and from Strategy into the bridge pools. Rewards will be sold and compounded to the asset used for stake rewards. Additionally, an input trigger for deposit, withdrawal, or reward claims will move funds to a higher paying pool if approved by the Oracle.

### Product:
The proposed product involves moving the demo contract to MasterStrategy and linking Oracle to Strategy to require approval for fund movements.

### Demo-contract:
The current demo contract allows deposit, withdrawal, compounding, and the ability to choose between (Stargate and Multiswap) to interact with internally.

### Additional Tool:
The proposed additional tool for development is an in-house gas optimizer.

### Potential Issues:
There may be potential issues with the Stargate pool, where reward tokens are only in decimals, resulting in a retention error and loss of funds (e.g., USDT pool).

###  Issues:
Celer: Here, the asset will be moved into farms (minimum deposit is 500 USDT, liquidity is low (2m$), and withdrawal isn't instant. ( Our test run indicated that just adding liquidity took up to 20 blocks to confirm).

Stargate: There is a chance that the liquidity we provide gets bridged to another chain. If so, we would need to transfer it back and pay the fee to do so.

Multiswap: There is a chance that the liquidity we provide gets bridged to another chain. If so, we would need to transfer it back and pay the fee to do so.


### Links 

Demo Contracts: [Link](https://github.com/Lefgk/Bridges/blob/main/contracts/)

Solidity : [Link](https://github.com/Lefgk/Bridges/blob/main/contracts/Staking.sol) 

Gas Reports: [MC Strategy](https://github.com/Lefgk/Bridges/blob/main/GasReports/GasReportStrategyMC.md), [MasterChef](https://github.com/Lefgk/Bridges/blob/main/GasReports/GasReportMC.md), [Demo](https://github.com/Lefgk/Bridges/blob/main/GasReports/GasReportStaking.md)


### `How to run`

npm i

npx hardhat test --network hardhat

