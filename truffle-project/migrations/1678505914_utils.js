let Utils = artifacts.require('./Utils.sol')
let Crowdfunding = artifacts.require('./Crowdfunding.sol')

module.exports = async function(_deployer) {
  await _deployer.deploy(Utils)
  _deployer.link(Utils, Crowdfunding)
};
