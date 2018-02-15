import * as Web3 from 'web3';
import assert from './utils/assert';
import ContentOwnerEntityWrapper from './contract_wrappers/ContentOwnerEntityWrapper';
import ContentWrapper from './contract_wrappers/ContentWrapper';
import EntityDirectoryWrapper from './contract_wrappers/EntityDirectoryWrapper';
import EntityWrapper from './contract_wrappers/EntityWrapper';
import IterativeContentWrapper from './contract_wrappers/IterativeContentWrapper';
import UniqueIdentifierEntityDirectoryWrapper from './contract_wrappers/UniqueIdentifierEntityDirectoryWrapper';
import UpdatableContentWrapper from './contract_wrappers/UpdatableContentWrapper';
import {
    ArtifactContentContractName,
    ArtifactDirectoryContractName,
    ArtifactEntityContractName,
    BoloExConfig,
    Web3Provider
    } from './types';
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

    private _web3Wrapper : Web3Wrapper;

    private _config: BoloExConfig;

    constructor(provider: Web3Provider, config: BoloExConfig) {
        assert.isWeb3Provider('provider', provider);

        this._config = config;
        this._web3Wrapper = new Web3Wrapper(provider, {
            gasPrice: config.gasPrice
        });
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
}