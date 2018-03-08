pragma solidity ^0.4.18;


import './EntityDirectory.sol';
import '../entity/Entity.sol';
import '../utils/StringUtils.sol';

contract UniqueIdentifierEntityDirectory is EntityDirectory {

    mapping(bytes32 => uint256) public uniqueIdentifier;
    
    function UniqueIdentifierEntityDirectory(
        IdentityProvider _identityProvider,
        string _identifier)
        EntityDirectory(_identityProvider, _identifier)
        public
    {
    }

    /**
     * @dev Add an entity to the directory based on its identifier.
     * No two entites with the same identifier can be added.
     * param _entity The entity to add.
     */
    function addEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        Entity entity = Entity(_entity);
        bytes32 identifier = entity.getIdentifierHash();
        require(identifier != StringUtils.getEmptyStringHash());

        // Check if the identifier was not already added
        require(uniqueIdentifier[identifier] == 0);

        super.addEntity(_entity);
        uniqueIdentifier[identifier] = entities.length;
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
        Entity entity = Entity(_entity);
        bytes32 identifier = entity.getIdentifierHash();
        uint256 identifierIndexAhead = uniqueIdentifier[identifier];
        require(identifierIndexAhead != 0);

        uniqueIdentifier[identifier] = 0;
        removeEntityFromList(
            identifierIndexAhead - 1);
    }
}