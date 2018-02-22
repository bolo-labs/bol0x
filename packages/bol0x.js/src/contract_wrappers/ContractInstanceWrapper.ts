import assert from '../utils/assert';
import ContractWrapper from './ContractWrapper';
import {
    ContractEventArgs,
    ContractEvents,
    EventCallback,
    IndexedFilterValues,
} from '../types';
import { IContract, IContractWithEvents } from './types';
import * as Web3 from 'web3';

export default abstract class ContractInstanceWrapper extends ContractWrapper
    implements IContract {
    public abstract getContractAddress(): string;

    /** @inheritDoc */
    public unsubscribe(subscriptionToken: string): void {
        super._unsubscribe(subscriptionToken);
    }

    /** @inheritDoc */
    public unsubscribeAll(): void {
        super._unsubscribeAll();
    }

    protected _subscribeForInstance<ArgsType extends ContractEventArgs>(
        eventName: ContractEvents,
        indexFilterValues: IndexedFilterValues,
        abi: Web3.AbiDefinition[],
        callback: EventCallback<ArgsType>
    ): string {
        assert.isFunction('callback', callback);

        const address = this.getContractAddress();
        return super._subscribe(
            address,
            eventName,
            indexFilterValues,
            abi,
            callback
        );
    }
}
