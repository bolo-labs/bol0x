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

describe('EntityDirectoryWrapper', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('creates the contract', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);

        // Act
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'EntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com'
        );

        // Assert
        expect(contractWrapper).not.to.be.null();
    });

    it('adds the entity in the directory', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.None,
            ''
        );
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'EntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com'
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

    it('fails to add the entity if not added by the owner', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.None,
            '',
            { from: accounts[0] }
        );
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'EntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com'
        );

        // Act
        try {
            await contractWrapper.addEntityAsync(entity.getContractAddress(), {
                from: accounts[1],
            });
            expect(
                false,
                'Adding the entity by someone else then owner should fail'
            ).to.be.true();
        } catch (error) {
            // Assert
            const entities = await contractWrapper.getAllEntitiesAsync();
            expect(entities.length).to.be.equal(0);
        }
    });

    it('removes the entity from the directory', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.None,
            ''
        );
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'EntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com'
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

    it('fails to remove if not removed by the owner of the entity', async () => {
        // Arrange
        const boloEx = new BoloEx(web3.currentProvider, config);
        const accounts = await promisify<string[]>(web3.eth.getAccounts)();
        const entity = await boloEx.createEntityWrapperAsync(
            'Entity',
            EntityIdentityProvider.None,
            ''
        );
        const contractWrapper = await boloEx.createDirectoryWrapperAsync(
            'EntityDirectory',
            EntityIdentityProvider.Email,
            'foo@bar.com'
        );
        await contractWrapper.addEntityAsync(entity.getContractAddress(), {
            from: accounts[0],
        });

        // Act
        try {
            await contractWrapper.removeEntityAsync(
                entity.getContractAddress(),
                {
                    from: accounts[1],
                }
            );

            expect(
                false,
                'Removing the entity by someone else then owner should fail'
            ).to.be.true();
        } catch (error) {
            // Assert
            const entities = await contractWrapper.getAllEntitiesAsync();
            expect(entities.length).to.be.equal(1);
            expect(entities[0]).to.be.equal(entity.getContractAddress());
        }
    });
});
