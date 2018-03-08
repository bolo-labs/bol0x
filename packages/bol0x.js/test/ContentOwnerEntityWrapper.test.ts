import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';
import { TransactionOpts, EntityIdentityProvider } from '../src/types';
import { promisify } from '@0xproject/utils';

chaiSetup.configure();
const expect = chai.expect;

const TRANSACTION_DEFAULTS = {
    gasLimit: constants.MAX_CONTENT_OWNER_ENTITY_CREATION_GAS,
};

describe('ContentOwnerEntityWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'ContentOwnerEntity',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('adds the content for entity', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'ContentOwnerEntity',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const content = await boloEx.createContentWrapperAsync(
            'Content',
            'test'
        );

        // Act
        await contractWrapper.addContentAsync(content.getContractAddress(), {
            from: accounts[0],
        });

        // Assert
        const ownedContent = await contractWrapper.getAllOwnedContentAsync();
        expect(ownedContent.length).to.be.equal(1);
        expect(ownedContent[0]).to.be.equal(content.getContractAddress());
    });

    it('deletes the content for entity', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'ContentOwnerEntity',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const content = await boloEx.createContentWrapperAsync(
            'Content',
            'test'
        );

        await contractWrapper.addContentAsync(content.getContractAddress(), {
            from: accounts[0],
        });

        // Act
        await contractWrapper.deleteContentAsync(content.getContractAddress(), {
            from: accounts[0],
        });

        // Assert
        const ownedContent = await contractWrapper.getContentAsync(0);
        expect(ownedContent).not.to.be.null();
        expect(ownedContent.contentAddress).to.be.equal(
            content.getContractAddress()
        );
        expect(ownedContent.isDeleted).to.be.true();
    });

    it('gets only the non-deleted content', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'ContentOwnerEntity',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const content1 = await boloEx.createContentWrapperAsync(
            'Content',
            'test1'
        );
        const content2 = await boloEx.createContentWrapperAsync(
            'Content',
            'test2'
        );

        await contractWrapper.addContentAsync(content1.getContractAddress(), {
            from: accounts[0],
        });
        await contractWrapper.addContentAsync(content2.getContractAddress(), {
            from: accounts[0],
        });
        await contractWrapper.deleteContentAsync(
            content1.getContractAddress(),
            {
                from: accounts[0],
            }
        );

        // Act
        const ownedContent = await contractWrapper.getAllOwnedContentAsync();

        // Assert
        expect(ownedContent).not.to.be.null();
        expect(ownedContent.length).to.be.equal(1);
        expect(ownedContent[0]).to.be.equal(content2.getContractAddress());
    });
});
