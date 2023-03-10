const Crowdfunding = artifacts.require("Crowdfunding");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Crowdfunding", function (accounts) {
  let crowdfunding
  const beneficiary = accounts[0]

  const ONE_ETH = web3.utils.toWei('1', 'ether')
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

  it("contract is initialized", async function () {
    const targetAmount = await crowdfunding.targetAmount()
    expect(targetAmount.toString()).to.equal(ONE_ETH.toString())

    const actualName = await crowdfunding.name()
    expect(actualName).to.equal('campaign name')

    const actualBeneficiary = await crowdfunding.beneficiary()
    expect(actualBeneficiary).to.equal(beneficiary)

    const actualState = await crowdfunding.state()
    expect(actualState.toString()).to.equal(ONGOING_STATE)
  });

  it("accepts ETH contributions", async function () {
    await crowdfunding.sendTransaction({ value: ONE_ETH, from: accounts[1] })

    const contributed = await crowdfunding.amounts(accounts[1])
    expect(contributed.toString()).to.equal(ONE_ETH.toString())

    const actualContributed = await crowdfunding.totalCollected()
    expect(actualContributed.toString()).to.equal(ONE_ETH.toString())
  })

  it("doesnt allow to contribute after deadline", async function () {
    try {
      await increaseTime(601)
      await mineBlock()
      await crowdfunding.sendTransaction({ value: ONE_ETH, from: accounts[1] })

      expect.fail('Should revert execution')
    } catch (error) {
      expect(error.message).to.include('Deadline has passed')
    }
  })

  it("sets state correctly when campaign fails", async function () {
    await increaseTime(601)
    await mineBlock()
    await crowdfunding.finishCrowdfunding()
    var actualState = await crowdfunding.state()
    expect(actualState.toString()).to.equal(FAILED_STATE)
  })

  it("sets state correctly when campaign succeeds", async function () {
    await crowdfunding.sendTransaction({ value: ONE_ETH, from: accounts[1] })
    await increaseTime(601)
    await mineBlock()
    await crowdfunding.finishCrowdfunding()
    var actualState = await crowdfunding.state()
    expect(actualState.toString()).to.equal(SUCCEDE_STATED)
  })

  it("allows to collect money from the campaign", async function () {
    await crowdfunding.sendTransaction({ value: ONE_ETH, from: accounts[1] })
    await increaseTime(601)
    await mineBlock()
    await crowdfunding.finishCrowdfunding()

    const initAmount = await web3.eth.getBalance(beneficiary)
    await crowdfunding.collect({ from: accounts[1] })

    const newBalance = await web3.eth.getBalance(beneficiary)

    var campaignResult = newBalance - initAmount;
    expect(campaignResult.toString()).to.equal(ONE_ETH)
  })

  it("refund money if campaign failed", async function () {
    const initAmount = await web3.eth.getBalance(accounts[1])

    await crowdfunding.sendTransaction({ value: ONE_ETH - 100, from: accounts[1] })
    await increaseTime(601)
    await mineBlock()
    await crowdfunding.finishCrowdfunding()

    const actualState = await crowdfunding.state()
    expect(actualState.toString()).to.equal(FAILED_STATE)

    await crowdfunding.withdraw({ from: accounts[1] })

    const finalBalance = await crowdfunding.totalCollected()
    expect(finalBalance.toString()).to.equal('0')
  })

  it("emits an event state when campaign is finished", async function () {
    await increaseTime(601)
    await mineBlock()

    const receipt = await crowdfunding.finishCrowdfunding()
    expect(receipt.logs).to.have.lengthOf(1)

    const campaignFinisedEvent = receipt.logs[0]
    expect(campaignFinisedEvent.event).to.equal("CampaignFinished")

    const eventArgs = campaignFinisedEvent.args

    expect(eventArgs.addr).to.equal(crowdfunding.address)
    expect(eventArgs.totalCollected.toString()).to.equal('0')
    expect(eventArgs.isSucceeded).to.equal(false)
  })

  it("allow owner to cancel the campaign", async function () {
    await crowdfunding.cancelCrowdfunding({ from: beneficiary })
    var actualState = await crowdfunding.state()
    expect(actualState.toString()).to.equal(FAILED_STATE)
  })

  it("doesnt allow non-owner to cancel the campaign", async function () {
    try {
      await crowdfunding.cancelCrowdfunding({ from: accounts[1] })
      expect.fail("Should revert transaction")
    } catch (error) {
      expect(error.message).to.include("caller is not the owner")
    }
  })

  async function increaseTime(increaseBySec) {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [increaseBySec]
      },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result)
        })

    })
  }

  async function mineBlock() {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: '2.0',
          method: 'evm_mine'
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve(result)
        })
    })
  }
});
