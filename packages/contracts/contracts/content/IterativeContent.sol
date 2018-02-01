pragma solidity ^0.4.18;

import './UpdatableContent.sol';

/**
 * @title Iterative Content
 * @dev The IterativeContent along with allowing you to change offchain content address also keeps track of older content addresses
 */
contract IterativeContent is UpdatableContent {

    string[] public iterations;

    /**
     * @dev It changes the offchain content address
     * @param _contentAddress A non-empty string that represents offchain content address
     */
    function changeContent(string _contentAddress) onlyOwner public {
        super.changeContent(_contentAddress);
        iterations.push(_contentAddress);
    }
}