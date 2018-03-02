import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';

chaiSetup.configure();
const expect = chai.expect;

describe('BoloEx library', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };

    it('test for true', async () => {
        const boloEx = new BoloEx(web3.currentProvider, config);
        const contentContract = await boloEx.createContentWrapperAsync(
            'Content',
            'test'
        );

        expect(contentContract).not.to.be.null();
    });
});
