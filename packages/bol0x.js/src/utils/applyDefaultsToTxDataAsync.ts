import * as _ from 'lodash';
import * as Web3 from 'web3';
import { TxData, TxDataPayable } from '@0xproject/types';

export default async function applyDefaultsToTxDataAsync<T extends TxData|TxDataPayable>(
    txData: T,
    defaults: Partial<TxData>,
    estimateGasAsync?: (txData: T) => Promise<number>,
): Promise<TxData> {
    // Gas amount sourced with the following priorities:
    // 1. Optional param passed in to public method call
    // 2. Global config passed in at library instantiation
    // 3. Gas estimate calculation + safety margin
    const removeUndefinedProperties = _.pickBy;
    const txDataWithDefaults = {
        ...removeUndefinedProperties(defaults),
        ...removeUndefinedProperties(txData as any),
        // HACK: TS can't prove that T is spreadable.
        // Awaiting https://github.com/Microsoft/TypeScript/pull/13288 to be merged
    };
    if (_.isUndefined(txDataWithDefaults.gas) && !_.isUndefined(estimateGasAsync)) {
        const estimatedGas = await estimateGasAsync(txData);
        txDataWithDefaults.gas = estimatedGas;
    }
    return txDataWithDefaults;
}