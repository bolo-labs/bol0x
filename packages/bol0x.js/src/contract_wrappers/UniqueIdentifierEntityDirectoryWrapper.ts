import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import { BigNumber } from 'bignumber.js';
import {
    EventCallback,
    IndexedFilterValues,
    MethodOpts,
    TransactionOpts
    } from '../types';
import { IEntityDirectoryMethods, IUniqueIdentifierEntityDirectoryWrapper } from './types';
import { InternalEntityDirectoryWrapper } from './EntityDirectoryWrapper';
import { UniqueIdentifierEntityDirectoryContract, UniqueIdentifierEntityDirectoryContractEventArgs, UniqueIdentifierEntityDirectoryEvents } from './generated/unique_identifier_entity_directory';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalUniqueIdentifierEntityDirectoryWrapper extends InternalEntityDirectoryWrapper implements IEntityDirectoryMethods {

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

export default class UniqueIdentifierEntityDirectoryWrapper extends InternalUniqueIdentifierEntityDirectoryWrapper implements IUniqueIdentifierEntityDirectoryWrapper {

    /** @inheritDoc */
    public subscribe<ArgsType extends UniqueIdentifierEntityDirectoryContractEventArgs>(
        eventName: UniqueIdentifierEntityDirectoryEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Content.ContentArtifact.abi,
            callback);
    }

}