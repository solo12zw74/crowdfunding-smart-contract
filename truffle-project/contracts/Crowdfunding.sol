// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Crowdfunding {
  enum State { Ongoing, Failed, Succeded, PaidOut }
  
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

  function currentTime() private view returns(uint) {
    return block.timestamp;
  }
}
