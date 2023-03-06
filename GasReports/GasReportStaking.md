# Report

## Gas Optimizations

|                 | Issue                                                                                        | Instances |
| --------------- | :------------------------------------------------------------------------------------------- | :-------: |
| [GAS-1](#GAS-1) | Using bools for storage incurs overhead                                                      |     1     |
| [GAS-2](#GAS-2) | State variables should be cached in stack variables rather than re-reading them from storage |     6     |
| [GAS-3](#GAS-3) | Use calldata instead of memory for function arguments that do not get mutated                |     1     |

### <a name="GAS-1"></a>[GAS-1] Using bools for storage incurs overhead

Use uint256(1) and uint256(2) for true/false to avoid a Gwarmaccess (100 gas), and to avoid Gsset (20000 gas) when changing from ‘false’ to ‘true’, after having been ‘true’ in the past. See [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27).

_Instances (1)_:

```solidity
File: example/Flattened.sol

123:     bool public addressesSet = false;

```

### <a name="GAS-2"></a>[GAS-2] State variables should be cached in stack variables rather than re-reading them from storage

The instances below point to the second+ access of a state variable within a function. Caching of a state variable replaces each Gwarmaccess (100 gas) with a much cheaper stack read. Other less obvious fixes/optimizations include having local memory caches of state variable structs, or having local caches of state variable contracts/addresses.

_Saves 100 gas per instance_

_Instances (6)_:

```solidity
File: example/Flattened.sol

139:         IBEP20(USDT).approve(stargateLPStaking, MAX_INT);

139:         IBEP20(USDT).approve(stargateLPStaking, MAX_INT);

140:         IBEP20(SUSDT).approve(stargateRouter, MAX_INT);

141:         IBEP20(SUSDT).approve(stargateLPStaking, MAX_INT);

141:         IBEP20(SUSDT).approve(stargateLPStaking, MAX_INT);

144:         IBEP20(USDT).approve(PancakeRouter, MAX_INT);

```

### <a name="GAS-3"></a>[GAS-3] Use calldata instead of memory for function arguments that do not get mutated

Mark data types as `calldata` instead of `memory` where possible. This makes it so that the data is not automatically loaded into memory. If the data passed into the function does not need to be changed (like updating values in an array), it can be passed in as `calldata`. The one exception to this is if the argument must later be passed into another function that takes an argument that specifies `memory` storage.

_Instances (1)_:

```solidity
File: example/Flattened.sol

164:     function compoundToStargate(uint256 _amount, address[] memory path) external {

```

## Non Critical Issues

|               | Issue                                    | Instances |
| ------------- | :--------------------------------------- | :-------: |
| [NC-1](#NC-1) | Return values of `approve()` not checked |     7     |
| [NC-2](#NC-2) | Event is missing `indexed` fields        |     2     |

### <a name="NC-1"></a>[NC-1] Return values of `approve()` not checked

Not all IERC20 implementations `revert()` when there's a failure in `approve()`. The function signature has a boolean return value and they indicate errors that way instead. By not checking the return value, operations that should have marked as failed, may potentially go through without actually approving anything

_Instances (7)_:

```solidity
File: example/Flattened.sol

138:         IBEP20(USDT).approve(stargateRouter, MAX_INT);

139:         IBEP20(USDT).approve(stargateLPStaking, MAX_INT);

140:         IBEP20(SUSDT).approve(stargateRouter, MAX_INT);

141:         IBEP20(SUSDT).approve(stargateLPStaking, MAX_INT);

142:         IBEP20(USDC).approve(MultiChainRouter, MAX_INT);

143:         IBEP20(STG).approve(PancakeRouter, MAX_INT);

144:         IBEP20(USDT).approve(PancakeRouter, MAX_INT);

```

### <a name="NC-2"></a>[NC-2] Event is missing `indexed` fields

Index event fields make the field more quickly accessible to off-chain tools that parse events. However, note that each index field costs extra gas during emission, so it's not necessarily best to index the maximum allowed per event (three fields). Each event should use three indexed fields if there are three or more fields, and gas usage is not particularly of concern for the events in question. If there are fewer than three fields, all of the fields should be indexed.

_Instances (2)_:

```solidity
File: example/Flattened.sol

113:     event Transfer(address indexed from, address indexed to, uint256 value);

119:     event Approval(address indexed owner, address indexed spender, uint256 value);

```

## Low Issues

|             | Issue                     | Instances |
| ----------- | :------------------------ | :-------: |
| [L-1](#L-1) | Unsafe ERC20 operation(s) |    10     |

### <a name="L-1"></a>[L-1] Unsafe ERC20 operation(s)

_Instances (10)_:

```solidity
File: example/Flattened.sol

138:         IBEP20(USDT).approve(stargateRouter, MAX_INT);

139:         IBEP20(USDT).approve(stargateLPStaking, MAX_INT);

140:         IBEP20(SUSDT).approve(stargateRouter, MAX_INT);

141:         IBEP20(SUSDT).approve(stargateLPStaking, MAX_INT);

142:         IBEP20(USDC).approve(MultiChainRouter, MAX_INT);

143:         IBEP20(STG).approve(PancakeRouter, MAX_INT);

144:         IBEP20(USDT).approve(PancakeRouter, MAX_INT);

148:         IBEP20(USDC).transferFrom(msg.sender, address(this), _amount);

157:         IBEP20(USDT).transferFrom(msg.sender, address(this), _amount);

193:         token.transfer(msg.sender, tokenBalance);

```
