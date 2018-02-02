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

    uint16 constant public EXTERNAL_QUERY_GAS_LIMIT = 4999;    // Changes to state require at least 5000 gas

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

    event ContentTransferred(
        address indexed to,
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

    function ContentOwnerEntity() Entity() public {
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
     * @dev Transfer the ownership of the content to some other entity
     * @param _content The address of the content contract that needs to be transferred
     * @param _to The entity that it needs to transfer to
     */
    function transferContentOwnership(
        address _content,
        address _to)
        onlyOwner
        nonEmptyContent(_content)
        public
    {
        uint256 indexAhead = contentIndex_[_content];
        require(indexAhead != 0);

        deleteContent(_content);

        // TODO-SECURITY: Potential of reentry issue, though would it be a problem as this function
        // is called by owner and if they have mallicious intent, they will only effect themselves.
        // Though it can be a problem if entity is an Organization and publishing content on behalf
        // of its other users in which case a malicious user can mess up the content owned by Organization.
        bool executed = _content.delegatecall(bytes4(keccak256("transferOwnership(address)")));

        require(executed);
        ContentTransferred(_to, _content, indexAhead.sub(1));
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