import * as _ from 'lodash';
import * as Web3 from 'web3';
import applyDefaultsToTxDataAsync from './applyDefaultsToTxDataAsync';
import { Artifact, TransactionOpts } from '../types';
import { promisify } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { TxData } from '@0xproject/types';

export default async function createContractInstance(
    ethApi: Web3.EthApi,
    web3Wrapper: Web3Wrapper,
    artifact: Artifact,
    contractArgs: any[],
    transactionOpts: TransactionOpts = {}
): Promise<Web3.ContractInstance> {
    const contract = ethApi.contract(artifact.abi);
    const promisifiedContractCreator = promisifyContractCreator<
        Web3.ContractInstance
    >(ethApi.contract(artifact.abi).new.bind(contract));

    const accounts = await promisify<string[]>(ethApi.getAccounts)();

    const txData: TxData = {
        gas: transactionOpts.gasLimit,
        gasPrice: transactionOpts.gasPrice,
    };
    const txDataWithDefaults = await applyDefaultsToTxDataAsync(
        txData,
        {
            ...web3Wrapper.getContractDefaults(),
            from: accounts[0],
            data: artifact.bytecode,
        } as any,
        estimateGasAsync.bind(void 0, ethApi, artifact)
    );

    const contractInstance = await promisifiedContractCreator(
        ...contractArgs,
        txDataWithDefaults
    );

    return contractInstance;
}

function promisifyContractCreator<A extends Web3.ContractInstance>(
    contractCreator: (...callArgs: any[]) => A
): (...callArgs: any[]) => Promise<A> {
    return (...callArgs: any[]) => {
        return new Promise<A>((resolve, reject) => {
            contractCreator(...callArgs, (err: any, result: A) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (result.address) {
                    resolve(result);
                    return;
                }
            });
        });
    };
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
