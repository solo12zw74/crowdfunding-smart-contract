// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Crowdfunding is Ownable {
    enum State {
        Ongoing,
        Failed,
        Succeded,
        PaidOut
    }

    event CampaignFinished(address addr, uint totalCollected, bool isSucceeded);

    // declare the deployed contract name
    string public name;

    // the funding campaign amount goal
    uint public targetAmount;

    // keep the date till which the campaign is valid
    uint public fundingDeadline;

    // where to send the funds if campaign is succeded
    address payable public beneficiary;

    // current campaign state
    State public state;

    // keeps the dictionary of all contributors acontributions
    mapping(address => uint) public amounts;

    // flag for define if campaign achieves the goal
    bool public collected;

    modifier inState(State expectedState) {
        require(expectedState == state, "Incorrect campaign state");
        _;
    }

    constructor(
        string memory _name,
        uint _targetAmountEth,
        uint _durationInMin,
        address payable _beneficiaryAddress
    ) {
        name = _name;
        targetAmount = _targetAmountEth * 1 ether;
        fundingDeadline = currentTime() + _durationInMin * 1 minutes;
        beneficiary = _beneficiaryAddress;
        state = State.Ongoing;
        transferOwnership(beneficiary);
    }

    receive() external payable inState(State.Ongoing) {
        require(beforeDeadline(), "Deadline has passed");
        amounts[msg.sender] += msg.value;

        if (targetAmount <= totalCollected()) {
            collected = true;
        }
    }

    function cancelCrowdfunding() public inState(State.Ongoing) onlyOwner() {
        require(beforeDeadline(), "Deadline has passed");

        state = State.Failed;
    }

    function finishCrowdfunding() public inState(State.Ongoing) {
        require(afterDeadline(), "Deadline has not passed");

        if (!collected) {
            state = State.Failed;
        } else {
            state = State.Succeded;
        }

        emit CampaignFinished(address(this), totalCollected(), collected);
    }

    function collect() public inState(State.Succeded) {
        if (beneficiary.send(totalCollected())) {
            state = State.PaidOut;
        } else {
            state = State.Failed;
        }
    }

    function withdraw() public inState(State.Failed) {
        require(amounts[msg.sender] > 0, "No funds for account");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        payable(msg.sender).transfer(contributed);
    }

    function totalCollected() public view returns (uint) {
        return address(this).balance;
    }

    function currentTime() private view returns (uint) {
        return block.timestamp;
    }

    function beforeDeadline() public view returns (bool) {
        return currentTime() < fundingDeadline;
    }

    function afterDeadline() internal view returns (bool) {
        return !beforeDeadline();
    }
}
