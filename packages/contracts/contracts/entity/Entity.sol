pragma solidity ^0.4.18;


import '../utils/Ownable.sol';
import '../utils/StringUtils.sol';

/**
 * @title Entity
 * @dev The entity that represents a person or an organization
 */
contract Entity is Ownable {

    /**
     * @dev The off chain identity provider if the entity want to
     * have a known identity.
     */
    enum IdentityProvider {
        ETH_ADDR,
        KEY_BASE,
        NAME,
        OTHER,
        TWITTER_HANDLE
    }

    /**
     * @dev The offchain identifier that corresponds to the identity provider.
     */
    string public identifier;

    IdentityProvider public identityProvider;

    function Entity(
        IdentityProvider _identityProvider,
        string _identifier)
        Ownable()
        public
    {
        require(StringUtils.isNotEmpty(_identifier));

        identityProvider = _identityProvider;
        identifier = _identifier;
    }
}