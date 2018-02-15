import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import EntityDirectoryWrapper, { IEntityDirectoryWrapper } from './EntityDirectoryWrapper';
import { BigNumber } from 'bignumber.js';
import { MethodOpts, TransactionOpts } from '../types';
import { UniqueIdentifierEntityDirectoryContract } from './generated/unique_identifier_entity_directory';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export interface IUniqueIdentifierEntityDirectoryWrapper extends IEntityDirectoryWrapper {

}

export default class UniqueIdentifierEntityDirectoryWrapper extends EntityDirectoryWrapper implements IUniqueIdentifierEntityDirectoryWrapper {

    private _uniqueIdentitiferEntityDirectoryContract: UniqueIdentifierEntityDirectoryContract | null = null;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId, contractAddress);
    }

    protected async _getContractAsync(): Promise<UniqueIdentifierEntityDirectoryContract> {
        if(!_.isNull(this._uniqueIdentitiferEntityDirectoryContract)) {
            return this._uniqueIdentitiferEntityDirectoryContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Directory.UniqueIdentifierEntityDirectoryArtifact,
            this._contractAddress);

        const contractInstance = new UniqueIdentifierEntityDirectoryContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._uniqueIdentitiferEntityDirectoryContract = contractInstance;
        return this._uniqueIdentitiferEntityDirectoryContract;
    }
}