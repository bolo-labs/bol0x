pragma solidity ^0.4.18;

import './Content.sol';
import '../utils/StringUtils.sol';

/**
 * @title Updatable Content
 * @dev The UpdateableContent contract allows the offchain content address to be updated in case of content change
 */
contract UpdatableContent is Content {

    uint256 public contentUpdateTime;

    event ContentChanged(string newContent);

    function UpdatableContent(
        string _contentAddress)
        Content(_contentAddress)
        Ownable()
        public
    {
        contentUpdateTime = now;
    }

    /**
     * @dev It changes the offchain content address
     * @param _contentAddress A non-empty string that represents offchain content address
     */
    function changeContent(
        string _contentAddress)
        onlyOwner
        public
    {
        require(StringUtils.isNotEmpty(_contentAddress));

        ContentChanged(_contentAddress);
        contentAddress = _contentAddress;
        contentUpdateTime = now;
    }
}