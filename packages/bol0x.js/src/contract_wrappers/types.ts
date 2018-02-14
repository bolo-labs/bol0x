import * as Web3 from 'web3';
import { TxData } from '@0xproject/types';
import ContractWrapper from './ContractWrapper';

export interface OwnableContract {
    owner: {
        callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string>
    };

    transferOwnership: {
        sendTransactionAsync(
            newOwner: string,
            txData: TxData | {},
        ): Promise<string>
    };
}

export abstract class OwnableContractWrapper<T extends OwnableContract> extends ContractWrapper {
    protected abstract _getContractAsync(): Promise<T>;
}