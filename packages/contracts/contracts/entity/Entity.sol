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
        NONE,
        ETH_ADDR,
        EMAIL,
        KEY_BASE,
        NAME,
        TWITTER_HANDLE,
        OTHER
    }

    /**
     * @dev The offchain identifier that corresponds to the identity provider.
     */
    string public identifier;

    /**
     * @dev The identity provider associated with the identifier.
     */
    IdentityProvider public identityProvider;

    function Entity(
        IdentityProvider _identityProvider,
        string _identifier)
        Ownable()
        public
    {
        if (_identityProvider == IdentityProvider.NONE) {
            // If the identity provider is none then set the
            // identifier to empty string
            identifier = "";
        } else {
            // If there is an identity provider then make sure
            // some identifier is passed in
            require(StringUtils.isNotEmpty(_identifier));
            identifier = _identifier;
        }

        identityProvider = _identityProvider;
    }
}