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
    txData: Partial<TxData>
): Promise<Web3.ContractInstance> {
    const contract = ethApi.contract(artifact.abi);
    const promisifiedContractCreator = await promisify<Web3.ContractInstance>(
        ethApi.contract(artifact.abi).new.bind(contract)
    );
    const txDataWithDefaults = await applyDefaultsToTxDataAsync(
        txData,
        estimateGasAsync.bind(void 0, ethApi, artifact)
    );
    const contractInstance = await promisifiedContractCreator(
        ...contractArgs,
        txDataWithDefaults
    );

    return contractInstance;
}

async function estimateGasAsync(
    ethApi: Web3.EthApi,
    artifact: Artifact,
    txData: TxData = {}
): Promise<number> {
    const txDataWithByteCode: Web3.CallData = _.merge(txData, {
        data: artifact.bytecode,
    });

    const gas = await promisify<number>(ethApi.estimateGas.bind(ethApi))(
        txDataWithByteCode
    );

    return gas;
}
