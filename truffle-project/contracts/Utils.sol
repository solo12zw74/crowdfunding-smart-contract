// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library Utils {
  function etherToWei(uint ethAmount) public pure returns(uint){
    return ethAmount * 1 ether;
  }

  function minutesToSeconds(uint min) public pure returns(uint){
    return min * 1 minutes;
  }
}
