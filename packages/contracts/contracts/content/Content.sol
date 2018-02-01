pragma solidity ^0.4.18;

import '../utils/Ownable.sol';

/**
 * @title Content
 * @dev The Content contract keeps track of content address that is published offchain
 */
contract Content is Ownable {
    string public contentAddress;

    /**
     * @dev The Content constructor sets the address of the content
     * @param _contentAddress Non empty string that represents the offchain content address
     */
    function Content(string _contentAddress) Ownable() public {
        require(isNotEmptyString(_contentAddress));

        contentAddress = _contentAddress;
    }

    /**
     * @dev Checks if the passed in string is not empty
     */
    function isNotEmptyString(string memory str) pure internal returns (bool) {
        bytes memory strBytes = bytes(str);
        return strBytes.length > 0;
    }
}