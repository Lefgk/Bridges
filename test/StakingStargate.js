const { expect } = require("chai");

const deployContracts = require("../testUtils/deployContracts");

function toBN(number, decimal) {
  return (number * 10 ** decimal).toLocaleString("fullwide", {
    useGrouping: false,
  });
}

const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const stargateRouterAddress = "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8";
const stargateLPStaking = "0x3052a0f6ab15b4ae1df39962d5ddefaca86dab47";
const SUSDT = "0x9aA83081AA06AF7208Dcc7A4cB72C94d057D2cda";
const STG = "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b";

const ownerSlot = "0x0";

describe("Staking contract to Stargate", function () {
  before(async () => {
    await deployContracts();
  });

  var usdt;
  var Susdt;

  it("Should deposit to Stargate to Stargate", async function () {
    // initial
    stg = await ethers.getContractAt("IUSDT", STG);
    usdt = await ethers.getContractAt("IUSDT", usdtAddress);
    Susdt = await ethers.getContractAt("IUSDT", SUSDT);
    stargateLPStakingcontract = await ethers.getContractAt(
      "LPStaking",
      stargateLPStaking
    );

    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    const value = ethers.utils.hexlify(ethers.utils.zeroPad(signerAddress, 32));
    await ethers.provider.send("hardhat_setStorageAt", [
      usdtAddress,
      ownerSlot,
      value,
    ]);
    expect(await usdt.mint(toBN(10000000, 18))).not.to.be.reverted;
    expect(await usdt.transfer(stakingContract.address, toBN(1, 18))).not.to.be
      .reverted;
    // approvals
    expect(await usdt.approve(stakingContract.address, toBN(10000000, 18))).not
      .to.be.reverted;
    expect(await usdt.approve(stargateRouterAddress, toBN(10000000, 18))).not.to
      .be.reverted;
    expect(await Susdt.approve(stargateLPStaking, toBN(10000000, 18))).not.to.be
      .reverted;
    expect(await stakingContract.approvals()).not.to.be.reverted;
    // deposit
    await stakingContract.depositToStargate(toBN(1, 18));
  });

  it("Should compound rewards", async function () {
    // buying some STG because we can't create yield in hardhat
    await stakingContract.compoundToStargate(10000000000, [usdtAddress, STG]);
    //
    const STGbal = await stg.balanceOf(stakingContract.address);
    await stakingContract.compoundToStargate(STGbal, [STG, usdtAddress]);
  });

  it("Should withdraw from Stargate in 1 tx", async function () {
    const amountFarmed = await stargateLPStakingcontract.userInfo(
      0,
      stakingContract.address
    );
    // withdraw
    await stakingContract.withrawFromStargate(amountFarmed.amount);
  });
});
