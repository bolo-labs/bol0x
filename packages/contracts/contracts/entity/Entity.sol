pragma solidity ^0.4.18;


import '../utils/Ownable.sol';
import '../utils/StringUtils.sol';

contract Entity is Ownable {

    string public name;

    function Entity(
        string _name)
        Ownable()
        public
    {
        require(StringUtils.isNotEmpty(_name));

        name = _name;
    }
}