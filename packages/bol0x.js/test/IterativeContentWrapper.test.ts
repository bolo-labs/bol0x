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

describe('IterativeContentWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createContentWrapperAsync(
            'IterativeContent',
            'test'
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('adds iteration when changing content address', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contractWrapper = await boloEx.createContentWrapperAsync(
            'IterativeContent',
            'test1'
        );

        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const contentAddressNew = 'test2';

        // Act
        await contractWrapper.changeContentAsync(contentAddressNew, {
            from: accounts[0],
        });

        // Assert
        const address = await contractWrapper.getContentAddressAsync();
        expect(address).to.be.equal(contentAddressNew);

        const totalIterations = await contractWrapper.getTotalIterationsAsync();
        expect(totalIterations.toNumber()).to.be.equal(2);

        const iterationAddress = await contractWrapper.getIterationAsync(1);
        expect(iterationAddress).to.be.equal(contentAddressNew);
    });

    it('returns the correct total iterations', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contractWrapper = await boloEx.createContentWrapperAsync(
            'IterativeContent',
            'test1'
        );

        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        // Act
        await contractWrapper.changeContentAsync('test2', {
            from: accounts[0],
        });
        await contractWrapper.changeContentAsync('test3', {
            from: accounts[0],
        });

        // Assert
        const totalIterations = await contractWrapper.getTotalIterationsAsync();
        expect(totalIterations.toNumber()).to.be.equal(3);
    });

    it('adds the content address from constructor in iteration', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contentAddress = 'test';

        // Act
        const contractWrapper = await boloEx.createContentWrapperAsync(
            'IterativeContent',
            contentAddress
        );

        // Assert
        const totalIterations = await contractWrapper.getTotalIterationsAsync();
        expect(totalIterations.toNumber()).to.be.equal(1);

        const iterationAddress = await contractWrapper.getIterationAsync(0);
        expect(iterationAddress).to.be.equal(contentAddress);
    });
});
