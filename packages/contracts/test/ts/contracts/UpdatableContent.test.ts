import Artifacts from '../../../utils/artifacts';
import chaiSetup from '../../../utils/chaiSetup';
import Web3 = require('web3');
import * as chai from 'chai';
import { promisify } from '@0xproject/utils';

chaiSetup.configure();
const expect = chai.expect;
const web3: Web3 = (global as any).web3;

const { UpdatableContent } = new Artifacts(artifacts);

contract('UpdatableContent', (accounts: string[]) => {
    const account = accounts[0];

    describe('constructor', () => {

        it('should create content', async () => {
            // Arrange
            const contentAddress = 'test1';

            // Act
            const content = await UpdatableContent.new(contentAddress, {from: account});

            // Assert
            const assignedContentAddress = await content.contentAddress.call();
            expect(assignedContentAddress).to.equal(contentAddress);

            const owner = await content.owner.call();
            expect(owner).to.equal(account);
        });
    });

    // describe('changeContent', () => {

    //     it('should change content address', async () => {
    //         // Arrange
    //         const contentAddress = 'test1';
    //         const content = await UpdatableContent.new(contentAddress, {from: account});
    //         const newContentAddress = 'test2';
            
    //         // Act
    //         await promisify<void>(content.changeContent)(newContentAddress, {from: account});

    //         // Assert
    //         const assignedContentAddress = await content.contentAddress.call();
    //         expect(assignedContentAddress).to.equal(newContentAddress);
    //     });
    // });
});