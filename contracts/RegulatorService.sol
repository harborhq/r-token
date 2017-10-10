pragma solidity ^0.4.15;

contract RegulatorService {
  struct TransferInfo {
    address token;
    address from;
    address to;
    uint    amount;
  }

  function get(address _address, uint256 _fact) constant returns (bool);
  function put(address _address, uint256 _fact, bool _value);
  function check(address _token, address _from, address _to, uint256 _amount) constant returns (bool);
}
