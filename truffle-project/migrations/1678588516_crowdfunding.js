let Crowdfunding = artifacts.require('./Crowdfunding.sol')

module.exports = async function (_deployer) {
  await _deployer.deploy(
    Crowdfunding,
    'Test campaign',
    1,
    3 * 24 * 60,
    '0x4eaFdAabB22Ce4756f4452f692255AeE2b100767')
};
