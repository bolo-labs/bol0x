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

describe('EntityWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Email,
            'foo@bar.com'
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('stores the correct identifier and identity provider', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Email,
            'foo@bar.com'
        );

        // Assert
        const identity = await contractWrapper.getIdentity();
        expect(identity.identifier).to.be.equal('foo@bar.com');
        expect(identity.identityProvider).to.be.equal(
            EntityIdentityProvider.Email
        );
    });
});
