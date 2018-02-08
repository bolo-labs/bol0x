pragma solidity ^0.4.18;


import './EntityDirectory.sol';
import '../entity/Entity.sol';
import '../utils/StringUtils.sol';

contract UniqueIdentifierEntityDirectory is EntityDirectory {

    mapping(bytes32 => uint256) public uniqueIdentifier;

    function addEntity(
        address _entity)
        onlyOwnerOrEntityOwner(_entity)
        public
    {
        Entity entity = Entity(_entity);
        bytes32 identifier = entity.getIdentifierHash();
        require(identifier != StringUtils.getEmptyStringHash());

        super.addEntity(_entity);
        uniqueIdentifier[identifier] = entities.length;
    }

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
            entities[identifierIndexAhead - 1],
            identifierIndexAhead - 1);
    }
}