// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
    enum State {
        Ongoing,
        Failed,
        Succeded,
        PaidOut
    }

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
    }

    receive() external payable inState(State.Ongoing) {
        amounts[msg.sender] += msg.value;

        if (targetAmount <= totalCollected()) {
            collected = true;
        }
    }

    function totalCollected() public view returns (uint) {
        return address(this).balance;
    }

    function currentTime() private view returns (uint) {
        return block.timestamp;
    }
}
