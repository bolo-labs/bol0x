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

    /**
     * @dev Add an entity to the directory.
     * param _entity The entity to add.
     */
    function addEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        entities.push(_entity);
        EntityAdded(_entity);
    }

    /**
     * @dev Remove an existing entity from the directory.
     * param _entity The entity to remove.
     */
    function removeEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        for (uint i = 0; i < entities.length; i++) {
            if (entities[i] == _entity) {
                removeEntityFromList(i);
                break;
            }
        }
    }

    /**
     * @dev Remove an existing entity from the list at a particular index.
     * param _index The index of the entity to remove from the list.
     */
    function removeEntityFromList(
        uint _index)
        internal
    {
        address entity = entities[_index];
        entities[_index] = entities[entities.length - 1];
        entities.length -= 1;

        EntityRemoved(entity);
    }

    /**
     * @dev Get all the entities in the directory.
     */
    function getAllEntities()
        external
        view
        returns (address[]) {

        return entities;
    }
}