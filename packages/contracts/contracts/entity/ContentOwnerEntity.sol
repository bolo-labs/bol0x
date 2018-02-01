pragma solidity ^0.4.18;


import './Entity.sol';
import '../content/Content.sol';

contract ContentOwnerEntity is Entity {
    struct OwnedContentInformation {
        address ownedContent;
        bool deleted;
    }

    OwnedContentInformation[] public ownedContent;

    mapping(address => uint256) private _contentIndex;
    uint256 private _totalUnDeletedContent;

    event ContentAdded(address content, uint256 index);
    event ContentDeleted(address content, uint256 index);
    event ContentTransferred(address to, address content, uint256 index);

    modifier nonEmptyContent(address content) {
        require(content != address(0));
        _;
    }

    function ContentOwnerEntity() Entity() public {
    }

    function addContent(address content) onlyOwner nonEmptyContent(content) public {
        uint256 newLength = ownedContent.push(OwnedContentInformation({
            ownedContent: content,
            deleted: false
        }));

        _contentIndex[content] = newLength;
        _totalUnDeletedContent++;

        ContentAdded(content, newLength - 1);
    }

    function deleteContent(address content) onlyOwner nonEmptyContent(content) public {
        uint256 indexAhead = _contentIndex[content];
        require(indexAhead != 0);

        uint256 contentIndex = indexAhead - 1;

        // Set the content to deleted
        ownedContent[contentIndex].deleted = true;
        _contentIndex[content] = 0;

        _totalUnDeletedContent--;

        ContentDeleted(content, contentIndex);
    }

    function transferContentOwnership(address content, address to) onlyOwner nonEmptyContent(content) public {

    }

    function getAllOwnedContent() external view returns(address[]) {
        address[] memory contentAddresses = new address[](_totalUnDeletedContent);

        uint256 counter = 0;
        
        for (uint256 i = 0; i < ownedContent.length; i++) {
            OwnedContentInformation storage content = ownedContent[i];
            if (!content.deleted) {
                contentAddresses[counter++] = content.ownedContent;
            }
        }

        return contentAddresses;
    }
}