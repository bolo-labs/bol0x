pragma solidity ^0.4.18;

import './UpdatableContent.sol';

contract IterativeContent is UpdatableContent {

    string[] public iterations;

    function changeContent(string _contentAddress) onlyOwner public {
        super.changeContent(_contentAddress);
        iterations.push(_contentAddress);
    }
}