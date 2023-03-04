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
const ownerSlot = "0x0";

describe("Staking contract", function () {
  before(async () => {
    await deployContracts();
  });
  var LPbal;
  var usdt;
  var Susdt;

  it("Should deposit to Stargate to Stargate", async function () {
    // initial
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

  it("Should withdraw from Stargate in 1 tx", async function () {
    const amountFarmed = await stargateLPStakingcontract.userInfo(
      0,
      stakingContract.address
    );
    // withdraw
    await stakingContract.withrawFromStargate(amountFarmed.amount);
  });
});
