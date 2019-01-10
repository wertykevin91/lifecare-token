pragma solidity ^0.5.0;

contract SupportedContract {
    event TestEvent(address indexed _from);

    function hasSupportFor(address t, uint256 u, bytes memory v) public returns(bool) {
        emit TestEvent(t);
        return true;
    }
}