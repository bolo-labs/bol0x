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
            'foo@bar.com'
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    // it('adds the content for entity', async () => {
    //     // Arrange
    //     const boloEx = new BoloEx(web3.currentProvider, config);
    //     const accounts = await promisify<string[]>(web3.eth.getAccounts)();
    //     const contractWrapper = await boloEx.createEntityWrapperAsync(
    //         'ContentOwnerEntity',
    //         EntityIdentityProvider.Email,
    //         'foo@bar.com'
    //     );

    //     const content = await boloEx.createContentWrapperAsync(
    //         'Content',
    //         'test'
    //     );

    //     // Act
    //     await contractWrapper.addContentAsync(content.getContractAddress(), {
    //         from: accounts[0],
    //     });

    //     // Assert
    //     const ownedContent = await contractWrapper.getAllOwnedContentAsync();
    //     expect(ownedContent.length).to.be.equal(1);
    //     expect(ownedContent[0]).to.be.equal(content.getContractAddress());
    // });
});
