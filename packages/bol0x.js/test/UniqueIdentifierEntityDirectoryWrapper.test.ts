import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';
import { TransactionOpts, EntityIdentityProvider } from '../src/types';
import { promisify } from '@0xproject/utils';
import assert from '../src/utils/assert';

chaiSetup.configure();
const expect = chai.expect;

const TRANSACTION_DEFAULTS = {
    gasLimit: 2_000_000,
};

describe('UniqueIdentifierEntityDirectoryWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        // Act
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'UniqueIdentifierEntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('adds the entity in the directory when the identifier is not in directory', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'UniqueIdentifierEntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Name,
            'foobar'
        );

        // Act
        await contractWrapper.addEntityAsync(entity.getContractAddress(), {
            from: accounts[0],
        });

        // Assert
        const entities = await contractWrapper.getAllEntitiesAsync();
        expect(entities.length).to.be.equal(1);
        expect(entities[0]).to.be.equal(entity.getContractAddress());
    });

    it('does not add the entity in the directory when the identifier is already used', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'UniqueIdentifierEntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Name,
            'foobar'
        );
        await contractWrapper.addEntityAsync(entity.getContractAddress(), {
            from: accounts[0],
        });

        const entityWithSameIdentifier = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Name,
            'foobar'
        );

        // Act
        try {
            await contractWrapper.addEntityAsync(
                entityWithSameIdentifier.getContractAddress(),
                {
                    from: accounts[0],
                }
            );
            expect(
                false,
                'Adding the same entity identifier should fail'
            ).to.be.true();
        } catch (error) {
            // Assert
            const entities = await contractWrapper.getAllEntitiesAsync();
            expect(entities.length).to.be.equal(1);
            expect(entities[0]).to.be.equal(entity.getContractAddress());
        }
    });

    it('removes the entity from the directory', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();

        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'UniqueIdentifierEntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com',
            { ...TRANSACTION_DEFAULTS }
        );

        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.Name,
            'foobar'
        );
        await contractWrapper.addEntityAsync(entity.getContractAddress(), {
            from: accounts[0],
        });

        // Act
        await contractWrapper.removeEntityAsync(entity.getContractAddress(), {
            from: accounts[0],
        });

        // Assert
        const entities = await contractWrapper.getAllEntitiesAsync();
        expect(entities.length).to.be.equal(0);
    });
});
