import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import { InternalEntityWrapper } from './EntityWrapper';
import { BigNumber } from 'bignumber.js';
import { EntityDirectoryContract, EntityDirectoryContractEventArgs, EntityDirectoryEvents } from './generated/entity_directory';
import { IEntityDirectoryWrapper, IEntityDirectoryMethods } from './types';
import { MethodOpts, TransactionOpts, IndexedFilterValues, EventCallback } from '../types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalEntityDirectoryWrapper extends InternalEntityWrapper implements IEntityDirectoryMethods {

    private _entityDirectoryContract: EntityDirectoryContract | null = null;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId, contractAddress);
    }

    /** @inheritDoc */
    public getContractAddress(): string {
        return this._contractAddress;
    }

    /** @inheritDoc */
    public async getEntityAsync(
        index: number | BigNumber,
        methodOpts?: MethodOpts
    ): Promise<string> {
        const contract = await this._getContractAsync();

        const indexBigNum: BigNumber = _.isFinite(index) ? new BigNumber(index) : index as BigNumber;
        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;

        return await contract.entities.callAsync(indexBigNum, defaultBlock);
    }

    /** @inheritDoc */
    public async getAllEntitiesAsync(
        methodOpts?: MethodOpts
    ): Promise<string[]> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        return await contract.getAllEntities.callAsync(defaultBlock);
    }

    /** @inheritDoc */
    public async addEntityAsync(
        contractAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('contractAddress', contractAddress);

        const contract = await this._getContractAsync();

        await contract.addEntity.sendTransactionAsync(
            contractAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    /** @inheritDoc */
    public async removeEntityAsync(
        contractAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('contractAddress', contractAddress);

        const contract = await this._getContractAsync();

        await contract.removeEntity.sendTransactionAsync(
            contractAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    protected async _getContractAsync(): Promise<EntityDirectoryContract> {
        if(!_.isNull(this._entityDirectoryContract)) {
            return this._entityDirectoryContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Directory.EntityDirectoryArtifact,
            this._contractAddress);

        const contractInstance = new EntityDirectoryContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._entityDirectoryContract = contractInstance;
        return this._entityDirectoryContract;
    }
}

export default class EntityDirectoryWrapper extends InternalEntityDirectoryWrapper implements IEntityDirectoryWrapper {

    /** @inheritDoc */
    public subscribe<ArgsType extends EntityDirectoryContractEventArgs>(
        eventName: EntityDirectoryEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        assert.doesBelongToStringEnum('eventName', eventName, EntityDirectoryEvents);

        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Directory.EntityDirectoryArtifact.abi,
            callback);
    }
}