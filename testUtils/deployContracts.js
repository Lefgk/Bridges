module.exports = async function () {
  const USDTContract = await ethers.getContractFactory("IUSDT");
  const USDCContract = await ethers.getContractFactory("IUSDC");
  const Staking = await ethers.getContractFactory("Staking");

  global.USDCContract = await USDCContract.deploy();
  global.USDTContract = await USDTContract.deploy();
  global.stakingContract = await Staking.deploy();

  const [owner, wallet1] = await ethers.getSigners();

  global.owner = owner;
  global.wallet1 = wallet1;
};
