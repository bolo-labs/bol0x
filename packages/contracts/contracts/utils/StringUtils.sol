pragma solidity ^0.4.18;

library StringUtils {

    /**
     * @dev Checks if the passed in string is not empty
     */
    function isNotEmpty(string memory _str) pure internal returns (bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }
}