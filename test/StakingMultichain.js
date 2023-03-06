const { expect } = require("chai");
const deployContracts = require("../testUtils/deployContracts");

function toBN(number, decimal) {
  return (number * 10 ** decimal).toLocaleString("fullwide", {
    useGrouping: false,
  });
}

var amountFarmed;
const usdcAddress = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
const anyUSDC = "0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2";
const USDC_WHALE = "0xc5168af77edb6915f42cd071e84a22a4b807edd2";

var MultiChainLPStakingcontract;
describe("Staking contract to Multichain", function () {
  before(async () => {
    await deployContracts();
  });

  it("Should deposit to MultiChain", async function () {
    // initial
    MultiChainLPStakingcontract = await ethers.getContractAt("IUSDC", anyUSDC);
    {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE],
      });
    }
    const whale = await ethers.getSigner(USDC_WHALE);
    const usdc = await ethers.getContractAt("IUSDC", usdcAddress);
    const accounts = await ethers.getSigners();

    await accounts[0].sendTransaction({
      to: whale.address,
      value: ethers.utils.parseEther("50.0"),
    });

    await usdc.connect(whale).transfer(accounts[0].address, toBN(1000, 18));

    {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE],
      });
    }

    // approvals
    expect(await usdc.approve(stakingContract.address, toBN(10000000, 18))).not
      .to.be.reverted;
    expect(await usdc.approve(anyUSDC, toBN(10000000, 18))).not.to.be.reverted;
    expect(await stakingContract.approvals()).not.to.be.reverted;
    // deposit
    expect(await stakingContract.depositToMultiChain(toBN(1, 18))).not.to.be
      .reverted;
  });

  it("Should withdraw from MultiChain", async function () {
    // get staked amount
    amountFarmed = await MultiChainLPStakingcontract.balanceOf(
      stakingContract.address
    );
    // withdraw
    expect(await stakingContract.withrawFromMultiChain(amountFarmed)).not.to.be
      .reverted;
  });
});
async function increaseTimeBy(amount) {
  var blockNumBefore = await ethers.provider.getBlockNumber();
  var blockBefore = await ethers.provider.getBlock(blockNumBefore);
  await time.increaseTo(blockBefore.timestamp + amount);
  var timestampBefore = blockBefore.timestamp;
  var date = new Date(timestampBefore * 1000);
  // console.log(`time now after increase by ${amount / oneday} days is ${date}`);
}
