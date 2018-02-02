pragma solidity ^0.4.18;


import './Entity.sol';
import '../content/Content.sol';
import '../utils/SafeMath.sol';

/**
 * @title Content owner entity
 * @dev The ContentOwnerEntity keeps track of the entity that owns various content.
 * This allows to aggregate all the content owned by an entity
 */
contract ContentOwnerEntity is Entity {

    using SafeMath for uint256;

    struct OwnedContent {
        address content;
        bool deleted;
    }

    event ContentAdded(
        address indexed content,
        uint256 index
    );

    event ContentDeleted(
        address indexed content,
        uint256 index
    );

    modifier nonEmptyContent(address content) {
        require(content != address(0));
        _;
    }

    OwnedContent[] public ownedContents;

    mapping(address => uint256) private contentIndex_;
    uint256 private totalUnDeletedContent_;

    function ContentOwnerEntity(
        string _name)
        Entity(_name)
        public
    {
        
    }

    /**
     * @dev Add content that is owned by the entity
     * @param _content The address of the content contract
     */
    function addContent(
        address _content)
        onlyOwner
        nonEmptyContent(_content)
        public
    {
        // Check if the owner of the content is the same
        require(contentIndex_[_content] == 0);
        require(msg.sender == Content(_content).owner());

        uint256 newLength = ownedContents.push(OwnedContent({
            content: _content,
            deleted: false
        }));

        contentIndex_[_content] = newLength;
        totalUnDeletedContent_ = totalUnDeletedContent_.add(1);

        ContentAdded(_content, newLength.sub(1));
    }

    /**
     * @dev Delete the content owned by the entity
     * @param _content The address of the content contract that needs to be deleted
     */
    function deleteContent(
        address _content)
        onlyOwner
        nonEmptyContent(_content)
        public
    {
        uint256 indexAhead = contentIndex_[_content];
        require(indexAhead != 0);

        uint256 indexOfContent = indexAhead.sub(1);

        // Set the content to deleted
        ownedContents[indexOfContent].deleted = true;
        contentIndex_[_content] = 0;

        totalUnDeletedContent_ = totalUnDeletedContent_.sub(1);

        ContentDeleted(_content, indexOfContent);
    }

    /**
     * @dev Get all the non-deleted content owned by the entity
     */
    function getAllOwnedContent() external view returns(address[])
    {
        address[] memory contentAddresses = new address[](totalUnDeletedContent_);

        uint256 counter = 0;
        
        for (uint256 i = 0; i < ownedContents.length; i++) {
            OwnedContent storage content = ownedContents[i];
            if (!content.deleted) {
                contentAddresses[counter++] = content.content;
            }
        }

        return contentAddresses;
    }
}