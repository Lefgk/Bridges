// SPDX-License-Identifier: Unlicense

pragma solidity 0.8.17;

interface IRouter {
    function addLiquidity(
        uint256 _poolId,
        uint256 _amountLD,
        address _to
    ) external;

    function instantRedeemLocal(
        uint16 _srcPoolId,
        uint256 _amountLP,
        address _to
    ) external;

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface ILPStaker {
    function deposit(uint256 _pid, uint256 _amount) external;

    function withdraw(uint256 _pid, uint256 _amount) external;
}

interface IMultiChainRouter {
    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;
}

interface IBEP20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the token decimals.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the token symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the token name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the bep token owner.
     */
    function getOwner() external view returns (address);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(
        address _owner,
        address spender
    ) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Staking {
    bool public addressesSet = false;
    address public immutable stargateRouter =
        0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8;
    address public immutable MultiChainRouter =
        0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2;
    address public immutable stargateLPStaking =
        0x3052A0F6ab15b4AE1df39962d5DdEFacA86DaB47;
    address public immutable STG = 0xB0D502E938ed5f4df2E681fE6E419ff29631d62b;
    address public immutable USDT = 0x55d398326f99059fF775485246999027B3197955;
    address public immutable USDC = 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d;
    address public immutable SUSDT = 0x9aA83081AA06AF7208Dcc7A4cB72C94d057D2cda;
    address public immutable PancakeRouter =
        0x10ED43C718714eb63d5aA57B78B54704E256024E;

    uint256 MAX_INT = 2 ** 256 - 1;

    constructor() {}

    function approvals() external {
        IBEP20(USDT).approve(stargateRouter, MAX_INT);
        IBEP20(USDT).approve(stargateLPStaking, MAX_INT);
        IBEP20(SUSDT).approve(stargateRouter, MAX_INT);
        IBEP20(SUSDT).approve(stargateLPStaking, MAX_INT);
        IBEP20(USDC).approve(MultiChainRouter, MAX_INT);
        IBEP20(STG).approve(PancakeRouter, MAX_INT);
        IBEP20(USDT).approve(PancakeRouter, MAX_INT);
    }

    function depositToMultiChain(uint256 _amount) external {
        IBEP20(USDC).transferFrom(msg.sender, address(this), _amount);
        IMultiChainRouter(MultiChainRouter).deposit(_amount);
    }

    function withrawFromMultiChain(uint256 _amount) external {
        IMultiChainRouter(MultiChainRouter).withdraw(_amount);
    }

    function depositToStargate(uint256 _amount) external {
        IBEP20(USDT).transferFrom(msg.sender, address(this), _amount);

        IRouter(stargateRouter).addLiquidity(2, _amount, address(this));
        uint256 _amountLP = IBEP20(SUSDT).balanceOf(address(this));
        ILPStaker(stargateLPStaking).deposit(0, _amountLP);
    }

    function compoundToStargate(
        uint256 _amount,
        address[] memory path
    ) external {
        //   ILPStaker(stargateLPStaking).deposit(0, 0);

        uint[] memory amounts = IRouter(PancakeRouter).swapExactTokensForTokens(
            _amount,
            0,
            path,
            address(this),
            2678053210
        );
        IRouter(stargateRouter).addLiquidity(2, amounts[1], address(this));
        uint256 _amountLP = IBEP20(SUSDT).balanceOf(address(this));
        ILPStaker(stargateLPStaking).deposit(0, _amountLP);
    }

    function withrawFromStargate(uint256 _amount) external {
        ILPStaker(stargateLPStaking).withdraw(0, _amount);

        uint256 _amountUSDT = IBEP20(SUSDT).balanceOf(address(this));
        IRouter(stargateRouter).instantRedeemLocal(
            2,
            _amountUSDT,
            address(this)
        );
    }

    /**
     * @dev Get all IBEP20 tokens
     * @param tokenAddr The token address.
     */
    function getAllTokens(address tokenAddr) external {
        IBEP20 token = IBEP20(tokenAddr);
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(msg.sender, tokenBalance);
    }
}
