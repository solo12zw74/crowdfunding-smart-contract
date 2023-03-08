const Crowdfunding = artifacts.require("Crowdfunding");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Crowdfunding", function (accounts) {
  let crowdfunding
  const beneficiary = accounts[0]

  const ONE_ETH = web3.eth.toWei('1', 'ether')
  const ONGOING_STATE = '0'
  const FAILED_STATE = '1'
  const SUCCEDE_STATED = '2'
  const PAIDOUT_STATE = '3'

  beforeEach(async function () {
    crowdfunding = await Crowdfunding.new(
      'campaign name',
      1,
      10,
      beneficiary,
      { from: beneficiary, gas: 2000000 })
  })

  it("should assert true", async function () {

  });
});
