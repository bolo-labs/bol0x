import * as _ from 'lodash';
import * as Web3 from 'web3';
import applyDefaultsToTxDataAsync from './applyDefaultsToTxDataAsync';
import { Artifact, TransactionOpts } from '../types';
import { promisify } from '@0xproject/utils';
import { TxData } from '@0xproject/types';

export default async function createContractInstance(
    ethApi: Web3.EthApi,
    artifact: Artifact,
    contractArgs: any[],
    txData: Partial<TxData>): Promise<Web3.ContractInstance> {

    const promisifiedContractCreator = await promisify<Web3.ContractInstance>(ethApi.contract(artifact.abi).new);
    const txDataWithDefaults = await applyDefaultsToTxDataAsync(txData, estimateGasAsync.bind(null, ethApi, artifact));
    const contractInstance = await promisifiedContractCreator(...contractArgs, txDataWithDefaults);

    return contractInstance;
}

async function estimateGasAsync(
    ethApi: Web3.EthApi,
    artifact: Artifact,
    txData: TxData = {}): Promise<number>
{
    const txDataWithDefaults = await applyDefaultsToTxDataAsync(
        txData,
        {}
    );

    const txDataWithByteCode: Web3.CallData = _.merge(txDataWithDefaults, { data: artifact.bytecode });

    const gas = await promisify<number>(
        ethApi.estimateGas
    )(txDataWithByteCode);

    return gas;
}