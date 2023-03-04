async function main() {
  const USDT = await ethers.getContractFactory("IUSDT");
  const USDTContract = await USDT.deploy();
  await USDTContract.deployed();

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy();
  await staking.deployed();
}
function toBN(number, decimal) {
  return (number * 10 ** decimal).toLocaleString("fullwide", {
    useGrouping: false,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
