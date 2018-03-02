import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';
import { TransactionOpts } from '../src/types';
import { promisify } from '@0xproject/utils';

chaiSetup.configure();
const expect = chai.expect;

describe('UpdatableContentWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createContentWrapperAsync(
            'UpdatableContent',
            'test'
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('gets the contract wrapper', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contentAddress = 'test address';
        const updatableContent = await boloEx.createContentWrapperAsync(
            'UpdatableContent',
            contentAddress
        );

        // Act
        const contractWrapper = boloEx.getContentWrapper(
            'UpdatableContent',
            updatableContent.getContractAddress()
        );

        // Assert
        const address = await contractWrapper.getContentAddressAsync();
        expect(address).to.be.equal(contentAddress);
    });

    it('updates the content address', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contentAddress = 'test address 1';
        const updatableContent = await boloEx.createContentWrapperAsync(
            'UpdatableContent',
            contentAddress
        );
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        const contentAddressNew = 'test address 2';

        // Act
        await updatableContent.changeContentAsync(contentAddressNew, {
            from: accounts[0],
        });

        // Assert
        const address = await updatableContent.getContentAddressAsync();
        expect(address).to.be.equal(contentAddressNew);
    });
});
