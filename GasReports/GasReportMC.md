# Report

## Gas Optimizations for https://bscscan.com/address/0x8536178222fC6Ec5fac49BbfeBd74CA3051c638f#code

|                 | Issue                                                                              | Instances |
| --------------- | :--------------------------------------------------------------------------------- | :-------: |
| [GAS-1](#GAS-1) | Using bools for storage incurs overhead                                            |     1     |
| [GAS-2](#GAS-2) | Use Custom Errors                                                                  |    28     |
| [GAS-3](#GAS-3) | Don't initialize variables with default value                                      |     4     |
| [GAS-4](#GAS-4) | Long revert strings                                                                |     6     |
| [GAS-5](#GAS-5) | Functions guaranteed to revert when called by normal users can be marked `payable` |    13     |
| [GAS-6](#GAS-6) | Using `private` rather than `public` for constants, saves gas                      |     3     |
| [GAS-7](#GAS-7) | Use != 0 instead of > 0 for unsigned integer comparison                            |    17     |

### <a name="GAS-1"></a>[GAS-1] Using bools for storage incurs overhead

Use uint256(1) and uint256(2) for true/false to avoid a Gwarmaccess (100 gas), and to avoid Gsset (20000 gas) when changing from ‘false’ to ‘true’, after having been ‘true’ in the past. See [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27).

_Instances (1)_:

```solidity
File: example/FlattenedMC.sol

1085:     mapping(IERC20 => bool) public poolExistence;

```

### <a name="GAS-2"></a>[GAS-2] Use Custom Errors

[Source](https://blog.soliditylang.org/2021/04/21/custom-errors/)
Instead of using error strings, to reduce deployment and runtime cost, you should use Custom Errors. This would save both deployment and runtime cost.

_Instances (28)_:

```solidity
File: example/FlattenedMC.sol

263:         require(owner() == _msgSender(), "Ownable: caller is not the owner");

282:         require(newOwner != address(0), "Ownable: new owner is the zero address");

444:         require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

519:         require(address(this).balance >= amount, "Address: insufficient balance");

522:         require(success, "Address: unable to send value, recipient may have reverted");

588:         require(address(this).balance >= value, "Address: insufficient balance for call");

659:                 require(isContract(target), "Address: call to non-contract");

816:             require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");

835:         require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");

852:             require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");

1071:         require(Migrator == msg.sender, "migrator only");

1088:         require(poolExistence[_lpToken] == false, "nonDuplicated: duplicated");

1103:         require(_depositFeeBP <= 601, "add: bad deposit fee");

1104:         require(_allocPoint <= 1e6, "add: invalid allocPoint");

1105:         require(address(_lpToken) != address(PigsV2Token), "add: no native token pool");

1106:         require(_harvestInterval <= MAXIMUM_HARVEST_INTERVAL, "add: invalid harvest interval");

1138:         require(_allocPoint <= 1e6, "set: invalid allocPoint");

1139:         require(_depositFeeBP <= 601, "set: bad deposit fee");

1140:         require(_harvestInterval <= MAXIMUM_HARVEST_INTERVAL, "set: invalid harvest interval");

1243:             require(_amount > 0, "no funds were received");

1286:             require(_amount > 0, "no funds were received");

1302:         require(user.amount >= _amount, "withdraw: not good");

1420:         require(address(_founder) != address(0), "!nonzero");

1426:         require(_newRewardsAmount <= 100, "too high reward");

1441:         require(_platformAddress != address(0), "!nonzero");

1447:         require(msg.sender == govAddress, "!gov");

1461:         require(_govAddress != address(0), "zero address");

1467:         require(_dogPoundAutoPool != address(0), "zero address");

```

### <a name="GAS-3"></a>[GAS-3] Don't initialize variables with default value

_Instances (4)_:

```solidity
File: example/FlattenedMC.sol

1004:     bool mintBurned = false;

1047:     uint256 public totalAllocPoint = 0;

1188:         for (uint256 pid = 0; pid < length; ++pid) {

1434:         for (uint256 pid = 0; pid < length; ++pid) {

```

### <a name="GAS-4"></a>[GAS-4] Long revert strings

_Instances (6)_:

```solidity
File: example/FlattenedMC.sol

282:         require(newOwner != address(0), "Ownable: new owner is the zero address");

522:         require(success, "Address: unable to send value, recipient may have reverted");

588:         require(address(this).balance >= value, "Address: insufficient balance for call");

816:             require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");

835:         require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");

852:             require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");

```

### <a name="GAS-5"></a>[GAS-5] Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided.

_Instances (13)_:

```solidity
File: example/FlattenedMC.sol

273:     function renounceOwnership() public virtual onlyOwner {

281:     function transferOwnership(address newOwner) public virtual onlyOwner {

1223:     function depositMigrator(address _userAddress, uint256 _pid, uint256 _amount) external nonReentrant onlyMigrator {

1410:     function increasePigsSupply(uint256 _amount) external onlyOwner {

1415:     function burnMint() external onlyOwner {

1419:     function setFoundersAddresses(IFounderStakerV2 _founder) external onlyOwner {

1425:     function setFoundersRewards(uint256 _newRewardsAmount) external onlyOwner {

1431:     function setFarmStartBlock(uint256 _newStartBlock) external onlyOwner {

1440:     function setPlatformAddress(address _platformAddress) external onlyOwner {

1456:     function setDDSCAAddress(IDDSCA _ddsca) external onlyOwner {

1460:     function setGov(address _govAddress) external onlyOwner {

1466:     function setDogPoundAutoPool(address _dogPoundAutoPool) external onlyOwner {

1472:     function updateMigrator(address _migrator) external onlyOwner {

```

### <a name="GAS-6"></a>[GAS-6] Using `private` rather than `public` for constants, saves gas

If needed, the values can be read from the verified contract source code, or if there are multiple values there can be a single getter function that [returns a tuple](https://github.com/code-423n4/2022-08-frax/blob/90f55a9ce4e25bceed3a74290b854341d8de6afa/src/contracts/FraxlendPair.sol#L156-L178) of the values of all currently-public constants. Saves **3406-3606 gas** in deployment gas due to the compiler not having to create non-payable getter functions for deployment calldata, not having to store the bytes of the value outside of where it's used, and not adding another entry to the method ID table

_Instances (3)_:

```solidity
File: example/FlattenedMC.sol

1003:     address public constant busdCurrencyAddress = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;

1013:     IUniswapV2Router02 public constant PancakeRouter = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);

1021:     uint256 public constant MAXIMUM_HARVEST_INTERVAL = 14 days;

```

### <a name="GAS-7"></a>[GAS-7] Use != 0 instead of > 0 for unsigned integer comparison

_Instances (17)_:

```solidity
File: example/FlattenedMC.sol

5: pragma solidity >=0.6.2;

137: pragma solidity >=0.6.2;

499:         return account.code.length > 0;

687:         if (returndata.length > 0) {

850:         if (returndata.length > 0) {

1167:         if (block.number > pool.lastRewardBlock && pool.lpSupply != 0 && totalAllocPoint > 0) {

1207:         if (multiplier > 0) {

1211:             if (pigsRewardOwner > 0) {

1235:         if (_amount > 0) {

1243:             require(_amount > 0, "no funds were received");

1246:             if (pool.depositFeeBP > 0) {

1278:         if (_amount > 0) {

1286:             require(_amount > 0, "no funds were received");

1306:         if (_amount > 0) {

1347:             if (pigsPending > 0 || user.rewardLockedUp > 0) {

1347:             if (pigsPending > 0 || user.rewardLockedUp > 0) {

1357:         } else if (pigsPending > 0) {

```

## Low Issues

|             | Issue                                   | Instances |
| ----------- | :-------------------------------------- | :-------: |
| [L-1](#L-1) | Do not use deprecated library functions |     2     |
| [L-2](#L-2) | Unsafe ERC20 operation(s)               |     2     |
| [L-3](#L-3) | Unspecific compiler version pragma      |     2     |

### <a name="L-1"></a>[L-1] Do not use deprecated library functions

_Instances (2)_:

```solidity
File: example/FlattenedMC.sol

797:     function safeApprove(IERC20 token, address spender, uint256 value) internal {

1396:             IERC20(token).safeApprove(address(_contract), type(uint256).max);

```

### <a name="L-2"></a>[L-2] Unsafe ERC20 operation(s)

_Instances (2)_:

```solidity
File: example/FlattenedMC.sol

1254:                     IERC20(token0).transfer(PLATFORM_ADDRESS, amount0);

1255:                     IERC20(token1).transfer(dripTaxVault, amount1);

```

### <a name="L-3"></a>[L-3] Unspecific compiler version pragma

_Instances (2)_:

```solidity
File: example/FlattenedMC.sol

5: pragma solidity >=0.6.2;

137: pragma solidity >=0.6.2;

```

## Medium Issues

|             | Issue                                  | Instances |
| ----------- | :------------------------------------- | :-------: |
| [M-1](#M-1) | Centralization Risk for trusted owners |    16     |

### <a name="M-1"></a>[M-1] Centralization Risk for trusted owners

#### Impact:

Contracts have owners with privileged rights to perform admin tasks and need to be trusted to not perform malicious updates or drain funds.

_Instances (16)_:

```solidity
File: example/FlattenedMC.sol

232: abstract contract Ownable is Context {

273:     function renounceOwnership() public virtual onlyOwner {

281:     function transferOwnership(address newOwner) public virtual onlyOwner {

995: contract MasterChefPigsV2 is Ownable, ReentrancyGuard {

1100:     ) external onlyOwner nonDuplicated(_lpToken) {

1137:     ) external onlyOwner {

1410:     function increasePigsSupply(uint256 _amount) external onlyOwner {

1415:     function burnMint() external onlyOwner {

1419:     function setFoundersAddresses(IFounderStakerV2 _founder) external onlyOwner {

1425:     function setFoundersRewards(uint256 _newRewardsAmount) external onlyOwner {

1431:     function setFarmStartBlock(uint256 _newStartBlock) external onlyOwner {

1440:     function setPlatformAddress(address _platformAddress) external onlyOwner {

1456:     function setDDSCAAddress(IDDSCA _ddsca) external onlyOwner {

1460:     function setGov(address _govAddress) external onlyOwner {

1466:     function setDogPoundAutoPool(address _dogPoundAutoPool) external onlyOwner {

1472:     function updateMigrator(address _migrator) external onlyOwner {

```
