import { BigNumber } from 'bignumber.js';
import { ContentContract, ContentContractEventArgs, ContentEvents } from './generated/content';
import { ContentOwnerEntityContractEventArgs, ContentOwnerEntityEvents } from './generated/content_owner_entity';
import {
    ContractEventArgs,
    ContractEvents,
    EventCallback,
    IndexedFilterValues,
    MethodOpts,
    TransactionOpts
    } from '../types';
import { EntityAddedContractEventArgs, EntityDirectoryContractEventArgs, EntityDirectoryEvents } from './generated/entity_directory';
import { EntityContractEventArgs, EntityEvents } from './generated/entity';
import { EntityIdentity, EntityIdentityProvider, EntityOwnedContent } from '../types';
import { IterativeContentContractEventArgs, IterativeContentEvents } from './generated/iterative_content';
import { UniqueIdentifierEntityDirectoryContractEventArgs, UniqueIdentifierEntityDirectoryEvents } from './generated/unique_identifier_entity_directory';
import { UpdatableContentContractEventArgs, UpdatableContentEvents } from './generated/updatable_content';

export interface IOwnerWrapper {
    /**
     * Retrieve the owner of the contract.
     * @param methodOpts Optional argument this method accepts.
     * @returns The ETH address of the owner of the contract.
     */
    getOwnerAsync(methodOpts?: MethodOpts): Promise<string>;

    /**
     * Transfer the ownership of the contract to a new owner.
     * @param newOwnerAddress The ETH address of the new owner.
     * @param transactionOpts Optional argument this method accepts.
     */
    transferOwnershipAsync(newOwnerAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

export interface IContract {
    /**
     * Get the address of the contract.
     * @returns The address of the contract.
     */
    getContractAddress(): string;
}

export interface IContractWithEvents<ContractEventsType extends ContractEvents, ContractEventArgsType extends ContractEventArgs> {
    /**
     * Subscribe to an event type emitted by the contract.
     * @param eventName The contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_contentAddress: stringForContentAddress}`.
     * @param callback Callback that gets called when a log is added/removed.
     * @returns Subscription token that can be used to unsubscribe.
     */
    subscribe<ArgsType extends ContractEventArgsType>(
        eventName: ContractEventsType,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>
    ): string;

    /**
     * Cancels a subscription.
     * @param subscriptionToken Subscription token returned by `subscribe(...)`.
     */
    unsubscribe(subscriptionToken: string): void;

    /**
     * Cancels all existing subscriptions.
     */
    unsubscribeAll(): void;
}

/**
 * ------------------------------------------------------------------------------
 * Content contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IContentMethods extends IOwnerWrapper {
    /**
     * Retrieve the content address.
     * @param methodOpts Optional argument this method accepts.
     * @return The content address stored in the contract.
     */
    getContentAddressAsync(methodOpts?: MethodOpts): Promise<string>;
}

export interface IContentWrapper 
    extends IContract,
            IContentMethods,
            IContractWithEvents<ContentEvents, ContentContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * UpdatableContent contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IUpdatableContentMethods extends IContentMethods {
    /**
     * Retrieves the time when the content was last updated.
     * @param methodOpts Optional arguments the method accepts.
     * @returns The time when the content was last updated.
     */
    getContentUpdateTimeAsync(methodOpts?: MethodOpts): Promise<Date>;

    /**
     * Changes the content address of the contract. This allows the user to refer to the same contract
     * and still be able to change the underlying content address.
     * @param newContentAddress The new content address which should be changed to in the contract.
     * @param transactionOpts Optional arguments the method accepts.
     */
    changeContentAsync(newContentAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

export interface IUpdatableContentWrapper
    extends IContract,
            IUpdatableContentMethods,
            IContractWithEvents<UpdatableContentEvents, UpdatableContentContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * IterativeContent contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IIterativeContentMethods extends IUpdatableContentMethods {
    /**
     * Retrieve the total number of iterations of the content change. Every time a user
     * changes the content address in the contract, that adds another iterations.
     * @param methodOpts Optional argumnt the method accepts.
     * @returns The total number of iterations.
     */
    getTotalIterationsAsync(methodOpts?: MethodOpts): Promise<BigNumber>;

    /**
     * Retrieved the contract address of the provider `index` iteration.
     * @param index The index of iteration that should be retrieved.
     * @param methodOpts Optional arguments that method accepts.
     * @returns The content address of the request iterations.
     */
    getIterationAsync(index: number | BigNumber, methodOpts?: MethodOpts): Promise<string>;
}

export interface IIterativeContentWrapper
    extends IContract,
            IIterativeContentMethods,
            IContractWithEvents<IterativeContentEvents, IterativeContentContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * Entity contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IEntityMethods extends IOwnerWrapper {
    /**
     * Retrieves the identity information of the entity.
     * @param methodOpts Optional argument the method accepts.
     * @returns The `EntityIdentity` which contains the identifier of the entity and its identity provider.
     */
    getIdentity(methodOpts?: MethodOpts): Promise<EntityIdentity>;
}

export interface IEntityWrapper
    extends IContract,
            IEntityMethods,
            IContractWithEvents<EntityEvents, EntityContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * ContentOwnerEntity contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IContentOwnerEntityMethods extends IEntityMethods {
    /**
     * Retrieves the content information at a particular index in all the content that entity has.
     * @param index The index of the content to retireve from the array.
     * @param methodOpts Optional argument the method accepts.
     * @returns The `EntityOwnedContent` contains information regarding the content address and if it is deleted by user or not.
     */
    getContentAsync(index: number | BigNumber, methodOpts?: MethodOpts): Promise<EntityOwnedContent>;

    /**
     * Retrieves all the un-deleted content owned by the entity.
     * @param methodOpts Optional argument the method accepts.
     * @returns The list of address for the content that is owned by entity.
     */
    getAllOwnedContentAsync(methodOpts?: MethodOpts): Promise<string[]>;

    /**
     * Add the content for the entity.
     * @param contentAddress The address of the content contract to add.
     * @param transactionOpts Optional argument the method accepts.
     */
    addContentAsync(contentAddress: string, transactionOpts?: TransactionOpts): Promise<void>;

    /**
     * Marks the content as deleted.
     * @param contentAddress The address of the content contract to delete.
     * @param transactionOpts Optional argument the method accepts.
     */
    deleteContentAsync(contentAddress: string, transactionOpts?: TransactionOpts): Promise<void>;
}

export interface IContentOwnerEntityWrapper
    extends IContract,
            IContentOwnerEntityMethods,
            IContractWithEvents<ContentOwnerEntityEvents, ContentOwnerEntityContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * EntityDirectory contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IEntityDirectoryMethods extends IEntityMethods {
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

export interface IEntityDirectoryWrapper
    extends IContract,
            IEntityDirectoryMethods,
            IContractWithEvents<EntityDirectoryEvents, EntityDirectoryContractEventArgs> {
}

/**
 * ------------------------------------------------------------------------------
 * UniqueIdentifierEntityDirectory contract interfaces
 * ------------------------------------------------------------------------------
*/

export interface IUniqueIdentifierEntityDirectoryWrapper
    extends IContract,
            IEntityDirectoryMethods,
            IContractWithEvents<UniqueIdentifierEntityDirectoryEvents, UniqueIdentifierEntityDirectoryContractEventArgs> {

}