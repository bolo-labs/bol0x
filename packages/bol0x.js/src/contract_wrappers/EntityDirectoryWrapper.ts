import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import EntityWrapper, { IEntityWrapper } from './EntityWrapper';
import { BigNumber } from 'bignumber.js';
import { EntityDirectoryContract } from './generated/entity_directory';
import { MethodOpts, TransactionOpts } from '../types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export interface IEntityDirectoryWrapper extends IEntityWrapper {
    /**
     * Retrieve a particular entity at the `index` from the array.
     * @param index The index of the entity to retireve from the array.
     * @param methodOpts Optional argument the method accepts.
     * @returns The contract address of the entity.
     */
    getEntityAsync(index: number | BigNumber, methodOpts?: MethodOpts): Promise<string>;

    /**
     * Retrieves all the entities in the directory.
     * @param methodOpts Optional argument the method accepts.
     * @returns List of all the entities in the directory.
     */
    getAllEntitiesAsync(methodOpts?: MethodOpts): Promise<string[]>;

    /**
     * Add an entity in the directory.
     * @param contractAddress Address of the entity contract to add.
     * @param transactionOpts Optional argument the method accepts.
     */
    addEntityAsync(contractAddress: string, transactionOpts?: TransactionOpts): Promise<void>;

    /**
     * Remove an entity from the directory.
     * @param contractAddress Address of the entity contract to remove.
     * @param transactionOpts Optional argument the method accepts.
     */
    removeEntityAsync(contractAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

export default class EntityDirectoryWrapper extends EntityWrapper implements IEntityDirectoryWrapper{

    private _entityDirectoryContract: EntityDirectoryContract | null = null;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId, contractAddress);
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