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
import { IIterativeContentMethods, IIterativeContentWrapper } from './types';
import { InternalUpdatableContentWrapper } from './UpdatableContentWrapper';
import {
    IterativeContentContract,
    IterativeContentContractEventArgs,
    IterativeContentEvents,
} from './generated/iterative_content';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export class InternalIterativeContentWrapper extends InternalUpdatableContentWrapper
    implements IIterativeContentMethods {
    private _iterativeContentContract: IterativeContentContract | null = null;

    constructor(
        web3Wrapper: Web3Wrapper,
        networkId: number,
        contractAddress: string
    ) {
        super(web3Wrapper, networkId, contractAddress);
    }

    /** @inheritDoc */
    public async getTotalIterationsAsync(
        methodOpts?: MethodOpts
    ): Promise<BigNumber> {
        const contract = await this._getContractAsync();

        const defaultBlock = _.isUndefined(methodOpts)
            ? undefined
            : methodOpts.defaultBlock;
        return await contract.getTotalIterations.callAsync(defaultBlock);
    }

    /** @inheritDoc */
    public async getIterationAsync(
        index: number | BigNumber,
        methodOpts?: MethodOpts
    ): Promise<string> {
        const contract = await this._getContractAsync();

        // Check if the index is a number then convert it into big number
        const indexBigNum: BigNumber = _.isFinite(index)
            ? new BigNumber(index)
            : (index as BigNumber);

        const defaultBlock = _.isUndefined(methodOpts)
            ? undefined
            : methodOpts.defaultBlock;
        return await contract.iterations.callAsync(indexBigNum, defaultBlock);
    }

    protected async _getContractAsync(): Promise<IterativeContentContract> {
        if (!_.isNull(this._iterativeContentContract)) {
            return this._iterativeContentContract;
        }

        const web3ContractInstance = await this._instantiateContractForAddress(
            Artifacts.Content.IterativeContentArtifact,
            this._contractAddress
        );

        const contractInstance = new IterativeContentContract(
            web3ContractInstance,
            this._web3Wrapper.getContractDefaults()
        );

        this._iterativeContentContract = contractInstance;
        return this._iterativeContentContract;
    }
}

export default class IterativeContentWrapper extends InternalIterativeContentWrapper
    implements IIterativeContentWrapper {
    /** @inheritDoc */
    public subscribe<ArgsType extends IterativeContentContractEventArgs>(
        eventName: IterativeContentEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string {
        assert.doesBelongToStringEnum(
            'eventName',
            eventName,
            IterativeContentEvents
        );

        return super._subscribeForInstance(
            eventName,
            indexFilterValues,
            Artifacts.Content.IterativeContentArtifact.abi,
            callback
        );
    }
}
