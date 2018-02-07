pragma solidity ^0.4.18;

library StringUtils {

    /**
     * @dev Checks if the passed string is not empty.
     */
    function isNotEmpty(string memory _str) pure internal returns (bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }

    /**
     * @dev Checks if the passed string is empty.
     */
    function isEmpty(string memory _str) pure internal returns (bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length == 0;
    }
}