import Artifacts from '../../../utils/artifacts';
import chaiSetup from '../../../utils/chaiSetup';
import Web3 = require('web3');
import * as chai from 'chai';

const { Content } = new Artifacts(artifacts);

chaiSetup.configure();
const expect = chai.expect;
const web3: Web3 = (global as any).web3;

contract('Content', (accounts: string[]) => {
    const account = accounts[0];

    describe('constructor', () => {

        it('should create', async () => {
            // Arrange
            const contentAddress = 'test';

            // Act
            const content = await Content.new(contentAddress, {from: account});

            // Assert
            const assignedContentAddress = await content.contentAddress.call();
            expect(assignedContentAddress).to.equal(contentAddress);
        });

        it('should fail when content address is empty', async () => {
            // Act
            try {
                const content = await Content.new('t', {from: account});
                expect.fail(null, null, 'The contract creation should have failed');
            } catch (e) {
                expect(e).to.not.be.null();
            }
        });
    });
});