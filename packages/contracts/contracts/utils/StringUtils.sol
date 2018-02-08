pragma solidity ^0.4.18;

library StringUtils {

    /**
     * @dev Checks if the passed string is not empty.
     */
    function isNotEmpty(
        string memory _str)
        pure
        internal
        returns (bool)
    {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }

    /**
     * @dev Checks if the passed string is empty.
     */
    function isEmpty(
        string memory _str)
         pure
         internal
         returns (bool)
    {
        bytes memory strBytes = bytes(_str);
        return strBytes.length == 0;
    }

    function getHash(
        string storage _str)
        pure
        internal
        returns (bytes32)
    {
        return keccak256(_str);
    }

    function getEmptyStringHash()
        pure
        internal
        returns (bytes32)
    {
        return keccak256("");
    }
}