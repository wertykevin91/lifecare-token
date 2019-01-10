pragma solidity ^0.5.0;

contract NotSupportedContract{

    event TestEvent(address indexed _from);
    
    function hasSupportFor(address t) public returns(bool) {
        emit TestEvent(t);
        revert("Not supported");
        return true;
    }
}