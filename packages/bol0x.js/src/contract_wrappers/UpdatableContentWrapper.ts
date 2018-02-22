import * as _ from 'lodash';
import Artifacts from '../Artifacts';
import assert from '../utils/assert';
import { BigNumber } from '@0xproject/utils';
import {
    EventCallback,
    IndexedFilterValues,
    MethodOpts,
    TransactionOpts,
} from '../types';
import { InternalContentWrapper } from './ContentWrapper';
import { IUpdatableContentMethods, IUpdatableContentWrapper } from './types';
import {
    UpdatableContentContract,
    UpdatableContentContractEventArgs,
    UpdatableContentEvents,
} from './generated/updatable_content';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalUpdatableContentWrapper extends InternalContentWrapper
    implements IUpdatableContentMethods {
    private _updatableContentContract: UpdatableContentContract | null = null;

    constructor(
        web3Wrapper: Web3Wrapper,
        networkId: number,
        contractAddress: string
    ) {
        super(web3Wrapper, networkId, contractAddress);
    }

    /** @inheritDoc */
    public async getContentUpdateTimeAsync(
        methodOpts?: MethodOpts
    ): Promise<Date> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts)
            ? undefined
            : methodOpts.defaultBlock;
        const result = await contract.contentUpdateTime.callAsync(defaultBlock);

        // TODO: Check if converting from BigNumber to number in case of time will have any issues
        return new Date(result.toNumber());
    }

    /** @inheritDoc */
    public async changeContentAsync(
        newContentAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<void> {
        const contract = await this._getContractAsync();

        await contract.changeContent.sendTransactionAsync(newContentAddress, {
            gas: transactionOpts.gasLimit,
            gasPrice: transactionOpts.gasPrice,
        });
    }

    protected async _getContractAsync(): Promise<UpdatableContentContract> {
        if (!_.isNull(this._updatableContentContract)) {
            return this._updatableContentContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Content.UpdatableContentArtifact,
            this._contractAddress
        );

        const contractInstance = new UpdatableContentContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults()
        );

        this._updatableContentContract = contractInstance;
        return this._updatableContentContract;
    }
}

export default class UpdatableContentWrapper extends InternalUpdatableContentWrapper
    implements IUpdatableContentWrapper {
    /** @inheritDoc */
    public subscribe<ArgsType extends UpdatableContentContractEventArgs>(
        eventName: UpdatableContentEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        assert.doesBelongToStringEnum(
            'eventName',
            eventName,
            UpdatableContentEvents
        );

        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Content.UpdatableContentArtifact.abi,
            callback
        );
    }
}
