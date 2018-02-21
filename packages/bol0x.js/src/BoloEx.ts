import * as Web3 from 'web3';
import Artifacts from './Artifacts';
import assert from './utils/assert';
import ContentOwnerEntityWrapper from './contract_wrappers/ContentOwnerEntityWrapper';
import ContentWrapper from './contract_wrappers/ContentWrapper';
import createContractInstance from './utils/createContractInstance';
import EntityDirectoryWrapper from './contract_wrappers/EntityDirectoryWrapper';
import EntityWrapper from './contract_wrappers/EntityWrapper';
import IterativeContentWrapper from './contract_wrappers/IterativeContentWrapper';
import UniqueIdentifierEntityDirectoryWrapper from './contract_wrappers/UniqueIdentifierEntityDirectoryWrapper';
import UpdatableContentWrapper from './contract_wrappers/UpdatableContentWrapper';
import {
    Artifact,
    ArtifactContentContractName,
    ArtifactDirectoryContractName,
    ArtifactEntityContractName,
    BoloExConfig,
    EntityIdentityProvider,
    TransactionOpts,
    Web3Provider
    } from './types';
import { getContentArtifact, getDirectoryArtifact, getEntityArtifact } from './utils/getArtifactForContract';
import {
    IContentOwnerEntityWrapper,
    IContentWrapper,
    IEntityDirectoryWrapper,
    IEntityWrapper,
    IIterativeContentWrapper,
    IUniqueIdentifierEntityDirectoryWrapper,
    IUpdatableContentWrapper
    } from './contract_wrappers/types';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

export type ContentWrapperTypes =
    | IContentWrapper
    | IUpdatableContentWrapper
    | IIterativeContentWrapper;

export type EntityWrapperTypes =
    | IEntityWrapper
    | IContentOwnerEntityWrapper;

export type DirectoryWrapperTypes =
    | IEntityDirectoryWrapper
    | IUniqueIdentifierEntityDirectoryWrapper;

export class BoloEx {

    private _web3: Web3;

    private _web3Wrapper : Web3Wrapper;

    private _config: BoloExConfig;

    constructor(provider: Web3Provider, config: BoloExConfig) {
        assert.isWeb3Provider('provider', provider);

        this._config = config;
        this._web3Wrapper = new Web3Wrapper(provider, {
            gasPrice: config.gasPrice
        });
        this._web3 = new Web3(provider);
    }

    /**
     * Get the wrapper for the contract to interact with it.
     * @param contractType The type of the contract instance wrapper to create.
     * @param contractAddress The address of the existing content contract.
     * @returns The wrapper for the contract to interact with it.
     */
    public getContentWrapper(
        contractType: 'Content',
        contractAddress: string
    ): IContentWrapper;
    public getContentWrapper(
        contractType: 'UpdatableContent',
        contractAddress: string
    ): IUpdatableContentWrapper;
    public getContentWrapper(
        contractType: 'IterativeContent',
        contractAddress: string
    ): IIterativeContentWrapper;
    public getContentWrapper(
        contractType: ArtifactContentContractName,
        contractAddress: string
    ): ContentWrapperTypes {
        return this._getContentWrapper(contractType, contractAddress);
    }

    /**
     * Get the wrapper for the contract to interact with it.
     * @param contractType The type of the contract instance wrapper to create.
     * @param contractAddress The address of the existing entity contract.
     * @returns The wrapper for the contract to interact with it.
     */
    public getEntityWrapper(
        contractType: 'Entity',
        contractAddress: string
    ): IEntityWrapper;
    public getEntityWrapper(
        contractType: 'ContentOwnerEntity',
        contractAddress: string
    ): IContentOwnerEntityWrapper;
    public getEntityWrapper(
        contractType: ArtifactEntityContractName,
        contractAddress: string
    ): EntityWrapperTypes {
        return this._getEntityWrapper(contractType, contractAddress);
    }

    /**
     * Get the wrapper for the contract to interact with it.
     * @param contractType The type of the contract instance wrapper to create.
     * @param contractAddress The address of the existing directory contract.
     * @returns The wrapper for the contract to interact with it.
     */
    public getDirectoryWrapper(
        contractType: 'EntityDirectory',
        contractAddress: string
    ): IEntityDirectoryWrapper;
    public getDirectoryWrapper(
        contractType: 'UniqueIdentifierEntityDirectory',
        contractAddress: string
    ): IUniqueIdentifierEntityDirectoryWrapper;
    public getDirectoryWrapper(
        contractType: ArtifactDirectoryContractName,
        contractAddress: string
    ): DirectoryWrapperTypes {
        return this._getDirectoryWrapper(contractType, contractAddress);
    }

    /**
     * Create a new contract instance for `Content`.
     * @param contractType The type of the contract instance you want to create.
     * @param contentAddress The address of the offchain content.
     * @param transactionOpts Optional argument the method accepts.
     * @returns The wrapper for the contract to interact with it.
     */
    public createContentWrapperAsync(
        contractType: 'Content',
        contentAddress: string,
        transactionOpts?: TransactionOpts
    ): Promise<IContentWrapper>;
    public createContentWrapperAsync(
        contractType: 'UpdatableContent',
        contentAddress: string,
        transactionOpts?: TransactionOpts
    ): Promise<IUpdatableContentWrapper>;
    public createContentWrapperAsync(
        contractType: 'IterativeContent',
        contentAddress: string,
        transactionOpts?: TransactionOpts
    ): Promise<IIterativeContentWrapper>;
    public async createContentWrapperAsync(
        contractType: ArtifactContentContractName,
        contentAddress: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<ContentWrapperTypes> {
        assert.isString('contentAddress', contentAddress);

        const artifact: Artifact = getContentArtifact(contractType);
        const contractInstance = await createContractInstance(
            this._web3.eth,
            artifact,
            [contentAddress],
            transactionOpts);

        return this._getContentWrapper(contractType, contractInstance.address);
    }

    /**
     * Create a new contract instance of `Entity`.
     * @param contractType The type of the entity contract instance you want to create.
     * @param identityProvider The provider of the identifier.
     * @param identifier The external identifier associated with the entity.
     * @param transactionOpts Optional argument the method accepts.
     * @returns The wrapper for the contract to interact with it.
     */
    public createEntityWrapperAsync(
        contractType: 'Entity',
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts?: TransactionOpts
    ): Promise<IEntityWrapper>;
    public createEntityWrapperAsync(
        contractType: 'ContentOwnerEntity',
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts?: TransactionOpts
    ): Promise<IContentOwnerEntityWrapper>;
    public async createEntityWrapperAsync(
        contractType: ArtifactEntityContractName,
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<EntityWrapperTypes> {
        assert.doesBelongToStringEnum(
            'identityProvider',
            identityProvider.toString(),
            EntityIdentityProvider);

        assert.isString('identifier', identifier);
        this._validateIdentityArgs(identityProvider, identifier);

        const artifact: Artifact = getEntityArtifact(contractType);
        const contractInstance = await createContractInstance(
            this._web3.eth,
            artifact,
            [identityProvider, identifier],
            transactionOpts
        );

        return this._getEntityWrapper(contractType, contractInstance.address);
    }

    /**
     * Create a new contract instance of `Directory`.
     * @param contractType The type of the directory contract instance you want to create.
     * @param identityProvider The provider of the identifier.
     * @param identifier The external identifier associated with the entity.
     * @param transactionOpts Optional argument the method accepts.
     * @returns The wrapper for the contract to interact with it.
     */
    public createDirectoryWrapperAsync(
        contractType: 'EntityDirectory',
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts?: TransactionOpts
    ): Promise<IEntityDirectoryWrapper>;
    public createDirectoryWrapperAsync(
        contractType: 'UniqueIdentifierEntityDirectory',
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts?: TransactionOpts
    ): Promise<IUniqueIdentifierEntityDirectoryWrapper>;
    public async createDirectoryWrapperAsync(
        contractType: ArtifactDirectoryContractName,
        identityProvider: EntityIdentityProvider,
        identifier: string,
        transactionOpts: TransactionOpts = {}
    ): Promise<DirectoryWrapperTypes> {
        assert.doesBelongToStringEnum(
            'identityProvider',
            identityProvider.toString(),
            EntityIdentityProvider);

        assert.isString('identifier', identifier);
        this._validateIdentityArgs(identityProvider, identifier);

        const artifact: Artifact = getDirectoryArtifact(contractType);
        const contractInstance = await createContractInstance(
            this._web3.eth,
            artifact,
            [identityProvider, identifier],
            transactionOpts
        );

        return this._getDirectoryWrapper(contractType, contractInstance.address);
    }

    /**
     * ------------------------------------------------------------------------------
     * Private methods
     * ------------------------------------------------------------------------------
    */
    private _getContentWrapper(
        contractType: ArtifactContentContractName,
        contractAddress: string
    ): ContentWrapperTypes {

        assert.isETHAddressHex('contractAddress', contractAddress);

        switch (contractType) {
            case 'Content':
                return new ContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'UpdatableContent':
                return new UpdatableContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'IterativeContent':
                return new IterativeContentWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            default:
                return assert.isNever('contractType', contractType);
        }
    }

    private _getEntityWrapper(
        contractType: ArtifactEntityContractName,
        contractAddress: string
    ): EntityWrapperTypes {
        assert.isETHAddressHex('contractAddress', contractAddress);

        switch (contractType) {
            case 'Entity':
                return new EntityWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'ContentOwnerEntity':
                return new ContentOwnerEntityWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            default:
                return assert.isNever('contractType', contractType);
        }
    }

    private _getDirectoryWrapper(
        contractType: ArtifactDirectoryContractName,
        contractAddress: string
    ): DirectoryWrapperTypes {
        assert.isETHAddressHex('contractAddress', contractAddress);

        switch (contractType) {
            case 'EntityDirectory':
                return new EntityDirectoryWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            case 'UniqueIdentifierEntityDirectory':
                return new UniqueIdentifierEntityDirectoryWrapper(this._web3Wrapper, this._config.networkId, contractAddress);
            default:
                return assert.isNever('contractType', contractType);
        }
    }

    private _validateIdentityArgs(identityProvider: EntityIdentityProvider, identifier: string) {
        if (identityProvider === EntityIdentityProvider.None) {
            assert.assert(identifier === '', `The identifier should be empty string when provider is ${identityProvider.toString()}`);
        } else if (identityProvider === EntityIdentityProvider.EtherAddress) {
            assert.isETHAddressHex('identifier', identifier);
        }
    }
}