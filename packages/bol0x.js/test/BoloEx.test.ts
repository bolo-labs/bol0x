import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';
import { TransactionOpts } from '../src/types';

chaiSetup.configure();
const expect = chai.expect;

describe('BoloEx library', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the "Content" contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contentContract = await boloEx.createContentWrapperAsync(
            'Content',
            'test'
        );

        // Assert
        expect(contentContract).not.to.be.null();
    });

    it('gets the contract wrapper', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contentAddress = 'test address';
        const contentContract = await boloEx.createContentWrapperAsync(
            'Content',
            contentAddress
        );

        // Act
        const contractWrapper = boloEx.getContentWrapper(
            'Content',
            contentContract.getContractAddress()
        );

        // Assert
        const address = await contractWrapper.getContentAddressAsync();
        expect(address).to.be.equal(contentAddress);
    });
});
