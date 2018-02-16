import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import ContractInstanceWrapper from './ContractInstanceWrapper';
import { BigNumber } from 'bignumber.js';
import { EntityContract, EntityContractEventArgs, EntityEvents } from './generated/entity';
import {
    EntityIdentity,
    EntityIdentityProvider,
    EventCallback,
    IndexedFilterValues,
    MethodOpts,
    TransactionOpts
    } from '../types';
import { IEntityMethods, IEntityWrapper, IOwnerWrapper } from './types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalEntityWrapper extends ContractInstanceWrapper implements IEntityMethods {

    private _entityContract: EntityContract | null = null;

    protected _contractAddress: string;

    constructor(web3Wrapper: Web3Wrapper, networkId: number, contractAddress: string) {
        super(web3Wrapper, networkId);

        assert.isETHAddressHex('contractAddress', contractAddress);

        this._contractAddress = contractAddress;
    }

    /** @inheritDoc */
    public getContractAddress(): string {
        return this._contractAddress;
    }

    /** @inheritDoc */
    public async getIdentity(methodOpts?: MethodOpts): Promise<EntityIdentity> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        const getIdentifierPromise = contract.identifier.callAsync(defaultBlock);
        const getIdentityProviderPromise = contract.identityProvider.callAsync(defaultBlock);

        const [identifier, identityProvider] = await Promise.all([getIdentifierPromise, getIdentityProviderPromise]);

        return {
            identifier: identifier,
            identityProvider: this.convertNumberToIdentityProvider(identityProvider)
        };
    }

    /** @inheritDoc */
    public async getOwnerAsync(methodOpts?: MethodOpts): Promise<string> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts) ? undefined : methodOpts.defaultBlock;
        return await contract.owner.callAsync(defaultBlock);
    }

    /** @inheritDoc */
    public async transferOwnershipAsync(
        newOwnerAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('newOwnerAddress', newOwnerAddress);

        const contract = await this._getContractAsync();

        await contract.transferOwnership.sendTransactionAsync(
            newOwnerAddress,
            {
                gas: transactionOpts.gasLimit,
                gasPrice: transactionOpts.gasPrice
            }
        );
    }

    protected convertNumberToIdentityProvider(num: BigNumber): EntityIdentityProvider {
        return num.toNumber() as EntityIdentityProvider;
    }

    protected async _getContractAsync(): Promise<EntityContract> {
        if(!_.isNull(this._entityContract)) {
            return this._entityContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Entity.EntityArtifact,
            this._contractAddress);

        const contractInstance = new EntityContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults());

        this._entityContract = contractInstance;
        return this._entityContract;
    }
}

export default class EntityWrapper extends InternalEntityWrapper implements IEntityWrapper {

    /** @inheritDoc */
    public subscribe<ArgsType extends EntityContractEventArgs>(
        eventName: EntityEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Entity.EntityArtifact.abi,
            callback);
    }
}