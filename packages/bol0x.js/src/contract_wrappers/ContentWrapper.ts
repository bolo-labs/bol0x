import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import ContractInstanceWrapper from './ContractInstanceWrapper';
import {
    ContentContract,
    ContentContractEventArgs,
    ContentEvents,
} from './generated/content';
import {
    EventCallback,
    IndexedFilterValues,
    MethodOpts,
    TransactionOpts,
} from '../types';
import { IContentMethods, IContentWrapper, IOwnerWrapper } from './types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalContentWrapper extends ContractInstanceWrapper
    implements IContentMethods {
    private _contentContract: ContentContract | null = null;

    protected _contractAddress: string;

    constructor(
        web3Wrapper: Web3Wrapper,
        networkId: number,
        contractAddress: string
    ) {
        super(web3Wrapper, networkId);

        assert.isETHAddressHex('contractAddress', contractAddress);

        this._contractAddress = contractAddress;
    }

    /** @inheritDoc */
    public getContractAddress(): string {
        return this._contractAddress;
    }

    /** @inheritDoc */
    public async getOwnerAsync(methodOpts?: MethodOpts): Promise<string> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts)
            ? undefined
            : methodOpts.defaultBlock;
        return await contract.owner.callAsync(defaultBlock);
    }

    /** @inheritDoc */
    public async transferOwnershipAsync(
        newOwnerAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        assert.isETHAddressHex('newOwnerAddress', newOwnerAddress);

        const contract = await this._getContractAsync();

        await contract.transferOwnership.sendTransactionAsync(newOwnerAddress, {
            gas: transactionOpts.gasLimit,
            gasPrice: transactionOpts.gasPrice,
        });
    }

    /** @inheritDoc */
    public async getContentAddressAsync(
        methodOpts?: MethodOpts
    ): Promise<string> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts)
            ? undefined
            : methodOpts.defaultBlock;
        return await contract.contentAddress.callAsync(defaultBlock);
    }
    protected async _getContractAsync(): Promise<ContentContract> {
        if (!_.isNull(this._contentContract)) {
            return this._contentContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Content.ContentArtifact,
            this._contractAddress
        );

        const contractInstance = new ContentContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults()
        );

        this._contentContract = contractInstance;
        return this._contentContract;
    }
}

export default class ContentWrapper extends InternalContentWrapper
    implements IContentWrapper {
    /** @inheritDoc */
    public subscribe<ArgsType extends ContentContractEventArgs>(
        eventName: ContentEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        assert.doesBelongToStringEnum('eventName', eventName, ContentEvents);

        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Content.ContentArtifact.abi,
            callback
        );
    }
}
