pragma solidity ^0.4.18;


import '../utils/Ownable.sol';
import '../utils/SafeMath.sol';
import '../entity/Entity.sol';

/**
 * @title Entity directory
 * @dev The contract maintains the list of 
 */
contract EntityDirectory is Entity {
    using SafeMath for uint256;

    event EntityAdded(
        address indexed entity
    );

    event EntityRemoved(
        address indexed entity
    );

    modifier onlyOwnerOrEntityOwner(address _entity) {
        require(msg.sender == owner || msg.sender == Entity(_entity).owner());
        _;
    }

    address[] public entities;

    function EntityDirectory(
        IdentityProvider _identityProvider,
        string _identifier)
        Entity(_identityProvider, _identifier)
        public
    {
    }

    function addEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        entities.push(_entity);
        EntityAdded(_entity);
    }

    function removeEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        for (uint i = 0; i < entities.length; i++) {
            if (entities[i] == _entity) {
                entities[i] = entities[entities.length - 1];
                entities.length -= 1;

                EntityRemoved(_entity);
                break;
            }
        }
    }
}