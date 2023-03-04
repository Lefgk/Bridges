# Report

## Gas Optimizations

|                   | Issue                                                                                        | Instances |
| ----------------- | :------------------------------------------------------------------------------------------- | :-------: |
| [GAS-1](#GAS-1)   | Use `selfbalance()` instead of `address(this).balance`                                       |     2     |
| [GAS-2](#GAS-2)   | Use assembly to check for `address(0)`                                                       |     3     |
| [GAS-3](#GAS-3)   | Using bools for storage incurs overhead                                                      |     3     |
| [GAS-4](#GAS-4)   | State variables should be cached in stack variables rather than re-reading them from storage |     4     |
| [GAS-5](#GAS-5)   | Use Custom Errors                                                                            |    25     |
| [GAS-6](#GAS-6)   | Don't initialize variables with default value                                                |     1     |
| [GAS-7](#GAS-7)   | Long revert strings                                                                          |     6     |
| [GAS-8](#GAS-8)   | Functions guaranteed to revert when called by normal users can be marked `payable`           |     4     |
| [GAS-9](#GAS-9)   | Using `private` rather than `public` for constants, saves gas                                |     1     |
| [GAS-10](#GAS-10) | Use != 0 instead of > 0 for unsigned integer comparison                                      |     4     |
| [GAS-11](#GAS-11) | `internal` functions not called by the contract should be removed                            |    10     |

### <a name="GAS-1"></a>[GAS-1] Use `selfbalance()` instead of `address(this).balance`

Use assembly when getting a contract's balance of ETH.

You can use `selfbalance()` instead of `address(this).balance` when getting your contract's balance of ETH to save gas.
Additionally, you can use `balance(address)` instead of `address.balance()` when getting an external contract's balance of ETH.

_Saves 15 gas when checking internal balance, 6 for external_

_Instances (2)_:

```solidity
File: example/Flattened.sol

552:         require(address(this).balance >= amount, "Address: insufficient balance");

621:         require(address(this).balance >= value, "Address: insufficient balance for call");

```

### <a name="GAS-2"></a>[GAS-2] Use assembly to check for `address(0)`

_Saves 6 gas per instance_

_Instances (3)_:

```solidity
File: example/Flattened.sol

328:         require(newOwner != address(0), "Ownable: new owner is the zero address");

991:         require(_feeAddress != address(0), "!nonzero");

998:         require(_earnedAddress != address(0), "!nonzero");

```

### <a name="GAS-3"></a>[GAS-3] Using bools for storage incurs overhead

Use uint256(1) and uint256(2) for true/false to avoid a Gwarmaccess (100 gas), and to avoid Gsset (20000 gas) when changing from ‘false’ to ‘true’, after having been ‘true’ in the past. See [source](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/58f635312aa21f947cae5f8578638a85aa2519f5/contracts/security/ReentrancyGuard.sol#L23-L27).

_Instances (3)_:

```solidity
File: example/Flattened.sol

181:     bool private _paused;

834:     bool public immutable isCAKEStaking;

835:     bool public immutable isStaking;

```

### <a name="GAS-4"></a>[GAS-4] State variables should be cached in stack variables rather than re-reading them from storage

The instances below point to the second+ access of a state variable within a function. Caching of a state variable replaces each Gwarmaccess (100 gas) with a much cheaper stack read. Other less obvious fixes/optimizations include having local memory caches of state variable structs, or having local caches of state variable contracts/addresses.

_Saves 100 gas per instance_

_Instances (4)_:

```solidity
File: example/Flattened.sol

895:         IERC20(wantAddress).safeTransferFrom(msg.sender, address(this), _wantAmt);

916:             IPancakeswapFarm(farmContractAddress).deposit(pid, _wantAmt);

939:         wantLockedTotal = wantLockedTotal - _wantAmt;

941:         IERC20(wantAddress).safeTransfer(MasterChefAddress, _wantAmt);

```

### <a name="GAS-5"></a>[GAS-5] Use Custom Errors

[Source](https://blog.soliditylang.org/2021/04/21/custom-errors/)
Instead of using error strings, to reduce deployment and runtime cost, you should use Custom Errors. This would save both deployment and runtime cost.

_Instances (25)_:

```solidity
File: example/Flattened.sol

116:         require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

225:         require(!paused(), "Pausable: paused");

232:         require(paused(), "Pausable: not paused");

309:         require(owner() == _msgSender(), "Ownable: caller is not the owner");

328:         require(newOwner != address(0), "Ownable: new owner is the zero address");

552:         require(address(this).balance >= amount, "Address: insufficient balance");

555:         require(success, "Address: unable to send value, recipient may have reverted");

621:         require(address(this).balance >= value, "Address: insufficient balance for call");

692:                 require(isContract(target), "Address: call to non-contract");

785:             require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");

804:         require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");

821:             require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");

859:         require(msg.sender == MasterChefAddress, "Only Masterchef!");

921:         require(_wantAmt > 0, "_wantAmt <= 0");

955:         require(isStaking, "!isStaking");

974:         require(msg.sender == govAddress, "Not authorised");

979:         require(msg.sender == govAddress, "Not authorised");

984:         require(msg.sender == govAddress, "!gov");

990:         require(msg.sender == govAddress, "!gov");

991:         require(_feeAddress != address(0), "!nonzero");

997:         require(msg.sender == govAddress, "!gov");

998:         require(_earnedAddress != address(0), "!nonzero");

1004:         require(msg.sender == govAddress, "!gov");

1010:         require(msg.sender == govAddress, "!gov");

1011:         require(_token != wantAddress, "!safe");

```

### <a name="GAS-6"></a>[GAS-6] Don't initialize variables with default value

_Instances (1)_:

```solidity
File: example/Flattened.sol

849:     uint256 public wantLockedTotal = 0;

```

### <a name="GAS-7"></a>[GAS-7] Long revert strings

_Instances (6)_:

```solidity
File: example/Flattened.sol

328:         require(newOwner != address(0), "Ownable: new owner is the zero address");

555:         require(success, "Address: unable to send value, recipient may have reverted");

621:         require(address(this).balance >= value, "Address: insufficient balance for call");

785:             require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");

804:         require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");

821:             require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");

```

### <a name="GAS-8"></a>[GAS-8] Functions guaranteed to revert when called by normal users can be marked `payable`

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided.

_Instances (4)_:

```solidity
File: example/Flattened.sol

319:     function renounceOwnership() public virtual onlyOwner {

327:     function transferOwnership(address newOwner) public virtual onlyOwner {

892:     function deposit(uint256 _wantAmt) external onlyMasterChef whenNotPaused nonReentrant returns (uint256) {

920:     function withdraw(uint256 _wantAmt) external onlyMasterChef nonReentrant returns (uint256) {

```

### <a name="GAS-9"></a>[GAS-9] Using `private` rather than `public` for constants, saves gas

If needed, the values can be read from the verified contract source code, or if there are multiple values there can be a single getter function that [returns a tuple](https://github.com/code-423n4/2022-08-frax/blob/90f55a9ce4e25bceed3a74290b854341d8de6afa/src/contracts/FraxlendPair.sol#L156-L178) of the values of all currently-public constants. Saves **3406-3606 gas** in deployment gas due to the compiler not having to create non-payable getter functions for deployment calldata, not having to store the bytes of the value outside of where it's used, and not adding another entry to the method ID table

_Instances (1)_:

```solidity
File: example/Flattened.sol

837:     address public constant cakeTokenAddress = 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82;

```

### <a name="GAS-10"></a>[GAS-10] Use != 0 instead of > 0 for unsigned integer comparison

_Instances (4)_:

```solidity
File: example/Flattened.sol

532:         return account.code.length > 0;

720:         if (returndata.length > 0) {

819:         if (returndata.length > 0) {

921:         require(_wantAmt > 0, "_wantAmt <= 0");

```

### <a name="GAS-11"></a>[GAS-11] `internal` functions not called by the contract should be removed

If the functions are required by an interface, the contract should inherit from that interface and use the `override` keyword

_Instances (10)_:

```solidity
File: example/Flattened.sol

551:     function sendValue(address payable recipient, uint256 amount) internal {

576:     function functionCall(address target, bytes memory data) internal returns (bytes memory) {

586:     function functionCall(

706:     function verifyCallResult(

751:     function safeTransfer(IERC20 token, address to, uint256 value) internal {

755:     function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {

766:     function safeApprove(IERC20 token, address spender, uint256 value) internal {

777:     function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {

782:     function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {

791:     function safePermit(

```

## Non Critical Issues

|               | Issue                                                                            | Instances |
| ------------- | :------------------------------------------------------------------------------- | :-------: |
| [NC-1](#NC-1) | Missing checks for `address(0)` when assigning values to address state variables |     4     |
| [NC-2](#NC-2) | Return values of `approve()` not checked                                         |     1     |
| [NC-3](#NC-3) | Event is missing `indexed` fields                                                |     9     |
| [NC-4](#NC-4) | Functions not used internally could be marked external                           |     1     |

### <a name="NC-1"></a>[NC-1] Missing checks for `address(0)` when assigning values to address state variables

_Instances (4)_:

```solidity
File: example/Flattened.sol

338:         _owner = newOwner;

874:         MasterChefAddress = _MasterChefAddress;

877:         wantAddress = _wantAddress;

881:             farmContractAddress = _farmContractAddress;

```

### <a name="NC-2"></a>[NC-2] Return values of `approve()` not checked

Not all IERC20 implementations `revert()` when there's a failure in `approve()`. The function signature has a boolean return value and they indicate errors that way instead. By not checking the return value, operations that should have marked as failed, may potentially go through without actually approving anything

_Instances (1)_:

```solidity
File: example/Flattened.sol

887:             IERC20(cakeTokenAddress).approve(address(cakePoolContract), type(uint256).max);

```

### <a name="NC-3"></a>[NC-3] Event is missing `indexed` fields

Index event fields make the field more quickly accessible to off-chain tools that parse events. However, note that each index field costs extra gas during emission, so it's not necessarily best to index the maximum allowed per event (three fields). Each event should use three indexed fields if there are three or more fields, and gas usage is not particularly of concern for the events in question. If there are fewer than three fields, all of the fields should be indexed.

_Instances (9)_:

```solidity
File: example/Flattened.sol

174:     event Paused(address account);

179:     event Unpaused(address account);

359:     event Transfer(address indexed from, address indexed to, uint256 value);

365:     event Approval(address indexed owner, address indexed spender, uint256 value);

852:     event FeeAddressUpdated(address feeAddress);

853:     event EarnedAddressUpdated(address earnedAddress);

854:     event GovUpdated(address govAddress);

855:     event StuckTokenRemoval(address token, uint256 amount, address to);

856:     event EarnDistributeThresholdUpdated(uint256 earnDistributeThreshold);

```

### <a name="NC-4"></a>[NC-4] Functions not used internally could be marked external

_Instances (1)_:

```solidity
File: example/Flattened.sol

1009:     function inCaseTokensGetStuck(address _token, uint256 _amount, address _to) public {

```

## Low Issues

|             | Issue                                   | Instances |
| ----------- | :-------------------------------------- | :-------: |
| [L-1](#L-1) | Do not use deprecated library functions |     1     |
| [L-2](#L-2) | Unsafe ERC20 operation(s)               |     1     |

### <a name="L-1"></a>[L-1] Do not use deprecated library functions

_Instances (1)_:

```solidity
File: example/Flattened.sol

766:     function safeApprove(IERC20 token, address spender, uint256 value) internal {

```

### <a name="L-2"></a>[L-2] Unsafe ERC20 operation(s)

_Instances (1)_:

```solidity
File: example/Flattened.sol

887:             IERC20(cakeTokenAddress).approve(address(cakePoolContract), type(uint256).max);

```

## Medium Issues

|             | Issue                                  | Instances |
| ----------- | :------------------------------------- | :-------: |
| [M-1](#M-1) | Centralization Risk for trusted owners |     3     |

### <a name="M-1"></a>[M-1] Centralization Risk for trusted owners

#### Impact:

Contracts have owners with privileged rights to perform admin tasks and need to be trusted to not perform malicious updates or drain funds.

_Instances (3)_:

```solidity
File: example/Flattened.sol

278: abstract contract Ownable is Context {

319:     function renounceOwnership() public virtual onlyOwner {

327:     function transferOwnership(address newOwner) public virtual onlyOwner {

```
