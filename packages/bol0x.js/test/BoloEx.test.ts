import * as chai from 'chai';
import BoloEx from '../src/BoloEx';
import chaiSetup from '../src/utils/chaiSetup';
import { BigNumber } from '@0xproject/utils';
import { web3Factory } from '@0xproject/dev-utils';
import constants from '../src/utils/constants';

describe('BoloEx library', () => {
    const web3 = web3Factory.create();
    const config = {
        networkId: constants.TESTRPC_NETWORK_ID,
    };
    const boloEx = new BoloEx(web3.currentProvider, config);

    it('test for true', async () => {
        const something = await boloEx.createContentWrapperAsync(
            'Content',
            'test'
        );
    });
});
