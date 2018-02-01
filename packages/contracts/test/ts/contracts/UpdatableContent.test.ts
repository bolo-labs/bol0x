
import Artifacts from '../../../utils/artifacts';
import chaiSetup from '../../../utils/chaiSetup';
import Web3 = require('web3');
import * as chai from 'chai';
import { promisify } from '@0xproject/utils';

const { UpdatableContent } = new Artifacts(artifacts);

chaiSetup.configure();
const expect = chai.expect;
const web3: Web3 = (global as any).web3;

contract('UpdatableContent', (accounts: string[]) => {
    const account = accounts[0];

    describe('changeContent', () => {

        it('should create', async () => {
            // Arrange
            const contentAddress = 'test1';
            const content = await UpdatableContent.new(contentAddress, {from: account});
            const newContentAddress = 'test2';

            // Act
            await promisify(UpdatableContent.changeContent)(newContentAddress, {from: account});

            // Assert
            const assignedContentAddress = await content.contentAddress.call();
            expect(assignedContentAddress).to.equal(contentAddress);
        });
    });
});