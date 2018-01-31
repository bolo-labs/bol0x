pragma solidity ^0.4.18;

import './Content.sol';
import '../utils/Ownable.sol';

contract UpdatableContent is Content, Ownable {
    event ContentChanged(string newContent);

    function UpdatableContent(string _contentAddress) Content(_contentAddress) Ownable() public {
    }

    function changeContent(string _contentAddress) onlyOwner public {
        require(isNotEmptyString(_contentAddress));

        ContentChanged(_contentAddress);
        contentAddress = _contentAddress;
    }
}