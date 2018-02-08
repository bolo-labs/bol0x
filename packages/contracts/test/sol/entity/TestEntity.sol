pragma solidity ^0.4.18;


import 'truffle/Assert.sol';
import '../../../contracts/entity/Entity.sol';

contract TestEntity {

    function testCreatingEntity() {
        // Act
        Entity entity = new Entity(
            Entity.IdentityProvider.NONE,
            "");

        // Assert
        Assert.equal(entity.owner(), this, "The owner should be the same as the contract address");
    }
}